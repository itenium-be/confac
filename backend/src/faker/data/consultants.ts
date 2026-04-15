// 16 curated consultants: 3 managers, 5 consultants, 5 freelancers, 3 externalConsultants.
// Freelancer/externalConsultant rows each reference a real partner slug from partners.ts.
// Contact data is fictional — these are NOT real people.
import {ConsultantRow} from '../types';

export const consultants: ConsultantRow[] = [
  // 3 managers
  {
    slug: 'lien-van-den-berg',
    firstName: 'Lien',
    lastName: 'Van den Berg',
    type: 'manager',
    telephone: '+32 477 10 20 30',
  },
  {
    slug: 'bart-claes',
    firstName: 'Bart',
    lastName: 'Claes',
    type: 'manager',
    telephone: '+32 477 10 20 31',
  },
  {
    slug: 'els-hermans',
    firstName: 'Els',
    lastName: 'Hermans',
    type: 'manager',
    telephone: '+32 477 10 20 32',
  },

  // 5 consultants
  {
    slug: 'jan-peeters',
    firstName: 'Jan',
    lastName: 'Peeters',
    type: 'consultant',
    telephone: '+32 477 10 20 33',
  },
  {
    slug: 'sofie-janssens',
    firstName: 'Sofie',
    lastName: 'Janssens',
    type: 'consultant',
    telephone: '+32 477 10 20 34',
  },
  {
    slug: 'tom-de-vos',
    firstName: 'Tom',
    lastName: 'De Vos',
    type: 'consultant',
    telephone: '+32 477 10 20 35',
  },
  {
    slug: 'anke-maes',
    firstName: 'Anke',
    lastName: 'Maes',
    type: 'consultant',
    telephone: '+32 477 10 20 36',
  },
  {
    slug: 'koen-willems',
    firstName: 'Koen',
    lastName: 'Willems',
    type: 'consultant',
    telephone: '+32 477 10 20 37',
  },

  // 5 freelancers
  {
    slug: 'lars-wouters',
    firstName: 'Lars',
    lastName: 'Wouters',
    type: 'freelancer',
    telephone: '+32 477 10 20 38',
    partnerSlug: 'devoteam',
  },
  {
    slug: 'eva-goossens',
    firstName: 'Eva',
    lastName: 'Goossens',
    type: 'freelancer',
    telephone: '+32 477 10 20 39',
    partnerSlug: 'axi',
  },
  {
    slug: 'nico-mertens',
    firstName: 'Nico',
    lastName: 'Mertens',
    type: 'freelancer',
    telephone: '+32 477 10 20 40',
    partnerSlug: 'euricom',
  },
  {
    slug: 'saar-dubois',
    firstName: 'Saar',
    lastName: 'Dubois',
    type: 'freelancer',
    telephone: '+32 477 10 20 41',
    partnerSlug: 'ixor',
  },
  {
    slug: 'pieter-lemaire',
    firstName: 'Pieter',
    lastName: 'Lemaire',
    type: 'freelancer',
    telephone: '+32 477 10 20 42',
    partnerSlug: 'codit',
  },

  // 3 externalConsultants
  {
    slug: 'marc-martin',
    firstName: 'Marc',
    lastName: 'Martin',
    type: 'externalConsultant',
    telephone: '+32 477 10 20 43',
    partnerSlug: 'in-the-pocket',
  },
  {
    slug: 'clara-dupont',
    firstName: 'Clara',
    lastName: 'Dupont',
    type: 'externalConsultant',
    telephone: '+32 477 10 20 44',
    partnerSlug: 'flexso',
  },
  {
    slug: 'simon-ferreira',
    firstName: 'Simon',
    lastName: 'Ferreira',
    type: 'externalConsultant',
    telephone: '+32 477 10 20 45',
    partnerSlug: 'avisi-group',
  },
];
