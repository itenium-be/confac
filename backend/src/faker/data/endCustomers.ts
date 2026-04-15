// backend/src/faker/data/endCustomers.ts
// 10 eindklant (endCustomer-type) clients. Real large BE corporates (+ 1 NL) that
// hire external dev teams. VATs verified via KBC.com, companyweb.be, VIES and
// company legal footers / annual reports.
import {ClientRow} from '../types';

export const endCustomers: ClientRow[] = [
  {
    // Verified: KBC Groep NV, BE0403.227.515, KBC.com bedrijfsgegevens + trendstop/companyweb
    slug: 'kbc',
    name: 'KBC Groep NV',
    btw: 'BE 0403.227.515',
    street: 'Havenlaan',
    streetNr: '2',
    postalCode: '1080',
    city: 'Brussel',
    country: 'BE',
    language: 'nl',
    contact: 'Sven Dhondt',
    telephone: '+32 2 429 12 34',
  },
  {
    // Verified: AG Insurance NV, BE0404.494.849, ag.be/legal + companyweb.be
    slug: 'ag-insurance',
    name: 'AG Insurance NV',
    btw: 'BE 0404.494.849',
    street: 'Emile Jacqmainlaan',
    streetNr: '53',
    postalCode: '1000',
    city: 'Brussel',
    country: 'BE',
    language: 'nl',
    contact: 'Nathalie De Wilde',
    telephone: '+32 2 664 81 11',
  },
  {
    // Verified: Proximus NV, BE0202.239.951, proximus.com/company + companyweb.be
    // frameworkAgreementStatus Verified — exercises the only status not used in partners/clients
    slug: 'proximus',
    name: 'Proximus NV',
    btw: 'BE 0202.239.951',
    street: 'Koning Albert II-laan',
    streetNr: '27',
    postalCode: '1030',
    city: 'Schaarbeek',
    country: 'BE',
    language: 'nl',
    contact: 'Peter Van Roy',
    telephone: '+32 2 202 41 11',
    frameworkAgreementStatus: 'Verified',
  },
  {
    // Verified: Colruyt Group NV, BE0400.378.485, companyweb.be + trendstop
    slug: 'colruyt',
    name: 'Colruyt Group NV',
    btw: 'BE 0400.378.485',
    street: 'Edingensesteenweg',
    streetNr: '196',
    postalCode: '1500',
    city: 'Halle',
    country: 'BE',
    language: 'nl',
    contact: 'Rik Vandevelde',
    telephone: '+32 2 363 55 45',
  },
  {
    // Verified: bpost NV, BE0214.596.464, companyweb.be + trendstop
    slug: 'bpost',
    name: 'bpost NV',
    btw: 'BE 0214.596.464',
    street: 'Anspachlaan',
    streetNr: '1',
    postalCode: '1000',
    city: 'Brussel',
    country: 'BE',
    language: 'nl',
    contact: 'Brigitte De Smedt',
    telephone: '+32 2 201 23 45',
  },
  {
    // Verified: Elia Transmission Belgium NV, BE0731.852.231, companyweb.be + trendstop
    // Brussels HQ, French street name → language fr
    slug: 'elia',
    name: 'Elia Transmission Belgium NV',
    btw: 'BE 0731.852.231',
    street: 'Boulevard de l\'Empereur',
    streetNr: '20',
    postalCode: '1000',
    city: 'Brussel',
    country: 'BE',
    language: 'fr',
    contact: 'Isabelle Verstraete',
    telephone: '+32 2 546 70 11',
  },
  {
    // Verified: Argenta Spaarbank NV, BE0404.453.574, companyweb.be + trendstop + northdata
    slug: 'argenta',
    name: 'Argenta Spaarbank NV',
    btw: 'BE 0404.453.574',
    street: 'Belgiëlei',
    streetNr: '49',
    postalCode: '2018',
    city: 'Antwerpen',
    country: 'BE',
    language: 'nl',
    contact: 'Anne Van Loo',
    telephone: '+32 3 285 77 77',
  },
  {
    // Verified: Fluvius System Operator CV, BE0477.445.084, companyweb.be + staatsbladmonitor
    slug: 'fluvius',
    name: 'Fluvius System Operator CV',
    btw: 'BE 0477.445.084',
    street: 'Brusselsesteenweg',
    streetNr: '199',
    postalCode: '9090',
    city: 'Melle',
    country: 'BE',
    language: 'nl',
    contact: 'Luc Demeester',
    telephone: '+32 78 35 35 34',
  },
  {
    // Verified: Brussels Airport Company NV, BE0890.082.292, companyweb.be + trendstop
    slug: 'brussels-airport',
    name: 'Brussels Airport Company NV',
    btw: 'BE 0890.082.292',
    street: 'Priester Cuypersstraat',
    streetNr: '3',
    postalCode: '1930',
    city: 'Zaventem',
    country: 'BE',
    language: 'nl',
    contact: 'Frank Casier',
    telephone: '+32 2 753 77 53',
  },
  {
    // Verified: ASML Holding NV, NL803441526B01, asml.com/en/terms-of-use
    // Only NL row — peppolEnabled true for consistency with BE defaults
    slug: 'asml-nl',
    name: 'ASML Holding NV',
    btw: 'NL803441526B01',
    street: 'De Run',
    streetNr: '6501',
    postalCode: '5504 DR',
    city: 'Veldhoven',
    country: 'NL',
    language: 'nl',
    contact: 'Marijn van den Berg',
    telephone: '+31 40 268 30 00',
    peppolEnabled: true,
  },
];
