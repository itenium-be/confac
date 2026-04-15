// backend/src/faker/data/partners.ts
// 10 onderaannemer (partner-type) clients. Real BE/NL IT consultancies
// with VATs verified via KBO / VIES / company legal footers.
//
// Substitutions from original plan:
//   ordina-belgium  → devoteam       (Ordina BE: KBO returns nothing; absorbed by Sopra Steria 2023)
//   aleri-solutions → codit          (aleri-solutions.be DNS does not resolve; not found in KBO)
//   bagaar          → inetum-belgium (bagaar.be redirects to Verhaert; Bagaar absorbed)
//   kunstmaan       → delaware       (kunstmaan.be → Accenture; fully absorbed, KBO 0 results)
//   ibidem          → cronos         (ibidem.eu 403; only unrelated BE homonyms found in KBO)
//   ordina-nederland→ avisi-group    (ordina.nl DNS does not resolve; Ordina NL absorbed by Sopra Steria)
//
// delaware and cronos are intentionally unreferenced downstream so the
// "add partner to existing project" UI flow has spare docs to work against.
import {ClientRow} from '../types';

export const partners: ClientRow[] = [
  {
    // Verified: VIES BE0466475275 valid; KBO 0466.475.275 active, NV DEVOTEAM, Machelen
    slug: 'devoteam',
    name: 'Devoteam NV',
    btw: 'BE 0466.475.275',
    street: 'Culliganlaan',
    streetNr: '3',
    postalCode: '1831',
    city: 'Machelen',
    country: 'BE',
    language: 'nl',
    contact: 'Jeroen De Smet',
    telephone: '+32 477 12 34 56',
    frameworkAgreementStatus: 'Sent',
  },
  {
    // Verified: VIES BE0407653980 valid; KBO 0407.653.980 active, NV AXI, Willebroek
    slug: 'axi',
    name: 'AXI NV',
    btw: 'BE 0407.653.980',
    street: 'Molenweg',
    streetNr: '107',
    postalCode: '2830',
    city: 'Willebroek',
    country: 'BE',
    language: 'nl',
    contact: 'Sofie Willems',
    telephone: '+32 3 860 40 00',
  },
  {
    // Verified: VIES BE0465357302 valid; KBO 0465.357.302 active, NV Euricom, Mechelen
    slug: 'euricom',
    name: 'Euricom NV',
    btw: 'BE 0465.357.302',
    street: 'Blarenberglaan',
    streetNr: '3',
    streetBox: 'A',
    postalCode: '2800',
    city: 'Mechelen',
    country: 'BE',
    language: 'nl',
    contact: 'Bart Claes',
    telephone: '+32 15 43 21 00',
  },
  {
    // Verified: VIES BE0478493179 valid; KBO 0478.493.179 active, BV IXOR, Mechelen
    slug: 'ixor',
    name: 'Ixor NV',
    btw: 'BE 0478.493.179',
    street: 'Schuttersvest',
    streetNr: '75',
    postalCode: '2800',
    city: 'Mechelen',
    country: 'BE',
    language: 'nl',
    contact: 'Lieve Janssens',
    telephone: '+32 15 27 88 50',
    frameworkAgreementStatus: 'WeSigned',
  },
  {
    // Verified: VIES BE0471349823 valid; KBO 0471.349.823 active, BVBA CODIT, Gent
    slug: 'codit',
    name: 'Codit NV',
    btw: 'BE 0471.349.823',
    street: 'Gaston Crommenlaan',
    streetNr: '14',
    streetBox: '301',
    postalCode: '9050',
    city: 'Gent',
    country: 'BE',
    language: 'nl',
    contact: 'Pieter Maes',
    telephone: '+32 9 265 80 00',
  },
  {
    // Verified: VIES BE0825170684 valid; KBO 0825.170.684 active, NV ITP Agency, Gent
    // Legal name is ITP Agency NV; trading name In The Pocket
    slug: 'in-the-pocket',
    name: 'ITP Agency NV',
    btw: 'BE 0825.170.684',
    street: 'Sassevaartstraat',
    streetNr: '46',
    streetBox: '401',
    postalCode: '9000',
    city: 'Gent',
    country: 'BE',
    language: 'nl',
    contact: 'Koen Peeters',
    telephone: '+32 9 234 34 25',
  },
  {
    // Verified: VIES BE0429037235 valid; KBO 0429.037.235 active, NV Inetum Belgium, Mechelen
    // Formerly RealDolmen NV
    slug: 'inetum-belgium',
    name: 'Inetum Belgium NV',
    btw: 'BE 0429.037.235',
    street: 'Antwerpsesteenweg',
    streetNr: '261',
    streetBox: '2',
    postalCode: '2800',
    city: 'Mechelen',
    country: 'BE',
    language: 'nl',
    contact: 'An Mertens',
    telephone: '+32 15 45 13 00',
  },
  {
    // Verified: VIES BE0479117543 valid; KBO 0479.117.543 active, DELAWARE CONSULTING CV, Kortrijk
    // Intentionally unreferenced downstream — used to exercise "add partner" UI flow
    slug: 'delaware',
    name: 'Delaware Consulting CV',
    btw: 'BE 0479.117.543',
    street: 'Kapel ter Bede',
    streetNr: '86',
    postalCode: '8500',
    city: 'Kortrijk',
    country: 'BE',
    language: 'nl',
    contact: 'Filip Goossens',
    telephone: '+32 56 26 14 00',
  },
  {
    // Verified: VIES BE0443807959 valid; KBO 0443.807.959 active, NV Cronos, Kontich
    // Intentionally unreferenced downstream — used to exercise "add partner" UI flow
    slug: 'cronos',
    name: 'Cronos NV',
    btw: 'BE 0443.807.959',
    street: 'Veldkant',
    streetNr: '35',
    streetBox: 'D',
    postalCode: '2550',
    city: 'Kontich',
    country: 'BE',
    language: 'nl',
    contact: 'Els Hermans',
    telephone: '+32 3 450 90 00',
  },
  {
    // Verified: VIES NL812403617B01 valid; registered AVISI GROUP B.V., Arnhem
    // Substitutes Ordina Nederland BV (ordina.nl DNS does not resolve; absorbed by Sopra Steria)
    slug: 'avisi-group',
    name: 'Avisi Group B.V.',
    btw: 'NL812403617B01',
    street: 'Nieuwe Stationsstraat',
    streetNr: '10',
    postalCode: '6811 KS',
    city: 'Arnhem',
    country: 'NL',
    language: 'nl',
    contact: 'Jan van der Meer',
    telephone: '+31 88 284 74 00',
  },
];
