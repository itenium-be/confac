/**
 * Parses a Belgian address into street, streetNr, and streetBox components
 * Examples:
 * - "Roger vandendriesschelaan 18/4" → street: "Roger vandendriesschelaan", streetNr: "18", streetBox: "4"
 * - "Prins boudewijnlaan 7B" → streetNr: "7", streetBox: "B"
 * - "Kempische Steenweg 303, bus 100" → streetNr: "303", streetBox: "100"
 * - "Arnaud Fraiteurlaan 15-23 A02" → streetNr: "15-23", streetBox: "A02"
 * - "Langeveldstraat 75 Bus 3" → streetNr: "75", streetBox: "3"
 * - "Brugsesteenweg 255, box2" → streetNr: "255", streetBox: "2"
 * - "Battelsesteenweg 455 I" → streetNr: "455", streetBox: "I"
 * - "Dokter de moorstraat 24-26" → streetNr: "24-26", streetBox: ""
 * - "Pastoor Coplaan 100," → streetNr: "100", streetBox: ""
 */
function parseAddress(address) {
  if (!address) {
    return { street: '', streetNr: '', streetBox: '' };
  }

  // Clean up: remove trailing comma and whitespace
  let cleaned = address.trim().replace(/,\s*$/, '').trim();

  // Match pattern: street name, then number (possibly with range), then optional box
  // The street number starts with a digit and may contain digits and hyphens (for ranges like 24-26)
  const match = cleaned.match(/^(.+?)\s+(\d+(?:-\d+)?)\s*(.*)$/);

  if (!match) {
    // No number found, return original as street
    return { street: cleaned, streetNr: '', streetBox: '' };
  }

  let street = match[1].trim();
  let streetNr = match[2];
  let remainder = match[3].trim();

  let streetBox = '';

  if (remainder) {
    // Check for various box patterns:
    // - /4, /A, /B (slash followed by box)
    // - B (letter immediately - but this would be caught differently)
    // - , bus 100 or bus 100 or Bus 3
    // - , box2 or box 2
    // - I (single letter)
    // - A02 (alphanumeric)

    // Pattern: starts with / (e.g., /4, /A, /B)
    const slashMatch = remainder.match(/^\/\s*(.+)$/);
    if (slashMatch) {
      streetBox = slashMatch[1].trim();
    }
    // Pattern: starts with comma and/or "bus" or "box" (case insensitive)
    else {
      const busBoxMatch = remainder.match(/^,?\s*(?:bus|box)\s*(.+)$/i);
      if (busBoxMatch) {
        streetBox = busBoxMatch[1].trim();
      }
      // Otherwise, the remainder is the box (e.g., "I", "A02")
      else {
        streetBox = remainder;
      }
    }
  }

  // Special case: number immediately followed by letter without space (e.g., "7B")
  // This means the regex above wouldn't have caught the B in remainder
  // Let's check if streetNr ends with a letter
  const nrWithLetterMatch = streetNr.match(/^(\d+)([A-Za-z])$/);
  if (nrWithLetterMatch && !streetBox) {
    streetNr = nrWithLetterMatch[1];
    streetBox = nrWithLetterMatch[2];
  }

  return { street, streetNr, streetBox };
}

module.exports = {
  async up(db) {
    const clients = await db.collection('clients').find({ address: { $exists: true } }).toArray();

    for (const client of clients) {
      const { street, streetNr, streetBox } = parseAddress(client.address);

      console.log(`Client "${client.name}" with "${client.address}"`);
      console.log(`"${street}", Nr="${streetNr}", Box="${streetBox}"`);
      console.log();

      await db.collection('clients').updateOne(
        { _id: client._id },
        {
          $set: { street, streetNr, streetBox },
          $unset: { address: '' }
        }
      );
    }

    console.log(`\nProcessed ${clients.length} clients`);
  },

  async down(db) {
    const clients = await db.collection('clients').find({
      $or: [
        { street: { $exists: true } },
        { streetNr: { $exists: true } },
        { streetBox: { $exists: true } }
      ]
    }).toArray();

    for (const client of clients) {
      const { street = '', streetNr = '', streetBox = '' } = client;
      let address = street;
      if (streetNr) {
        address += ` ${streetNr}`;
        if (streetBox) {
          address += `/${streetBox}`;
        }
      }

      await db.collection('clients').updateOne(
        { _id: client._id },
        {
          $set: { address: address.trim() },
          $unset: { street: '', streetNr: '', streetBox: '' }
        }
      );
    }
  }
};
