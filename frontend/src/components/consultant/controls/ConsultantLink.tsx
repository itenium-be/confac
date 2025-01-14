import {Link} from 'react-router-dom';
import {ConsultantModel} from '../models/ConsultantModel';


export type ConsultantProps = {
  consultant: ConsultantModel;
}

/** Text link to consultant details page */
export const ConsultantLink = ({consultant}: ConsultantProps) => (
  <Link to={`/consultants/${consultant.slug}`}>
    {`${consultant.firstName} ${consultant.name}`}
  </Link>
);
