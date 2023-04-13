import { ReactNode, useState } from "react"

interface Props {
  children: ReactNode,
  header: string,
  isCollapsed?: boolean
}

const MeasurementAccordionItem = ({children, header, isCollapsed = true}: Props) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  return (
    <div className="accordion-item">
    <h2 className="accordion-header">
      <button
        className={collapsed ? "accordion-button collapsed": "accordion-button"}
        type="button"
        data-bs-toggle="collapse"
        onClick={() => setCollapsed(!collapsed)}
      >
        {header}
      </button>
    </h2>
    <div
      className={collapsed ? "accordion-collapse collapse": "accordion-collapse collapse show"}
      data-bs-parent="#measurementAccordion"
    >
      <div className="accordion-body">
        {children}
      </div>
    </div>
  </div>
  )
}

export default MeasurementAccordionItem