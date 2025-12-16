import {useState} from 'react';
import {Link} from 'react-router';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {ProjectModal} from './ProjectModal';
import {ProjectLink, ProjectProps} from './ProjectLink';


type ProjectLinkWithModalProps = ProjectProps & {
  /** Custom display text instead of default "consultant @ client" */
  displayText?: string;
};

/** Link to a Project with option to open a Modal */
export const ProjectLinkWithModal = ({project, displayText}: ProjectLinkWithModalProps) => {
  const [hover, setHover] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  if (!project) {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{display: 'inline-flex', alignItems: 'center'}}
    >
      {displayText ? (
        <Link to={`/projects/${project._id}`}>{displayText}</Link>
      ) : (
        <ProjectLink project={project} />
      )}

      <Icon
        className="tst-open-project-modal-link"
        title={t('project.openModal')}
        size={1}
        style={{marginLeft: 8, color: 'grey', visibility: hover ? 'unset' : 'hidden'}}
        onClick={() => setModal(true)}
        fa="fa fa-external-link-alt"
      />

      {modal && (
        <ProjectModal
          project={project}
          show={modal}
          onClose={() => {
            setModal(false);
            setHover(false);
          }}
        />
      )}
    </div>
  );
};
