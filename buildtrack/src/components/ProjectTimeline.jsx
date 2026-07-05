function ProjectTimeline({project}){
  const steps=["Foundation","Columns","Brick Work","Roof","Electrical","Painting","Finishing"];
  const completed=project.completedStages||[];
  return(
    <div className="dashboard-box">
      <h2>Project Timeline</h2>
      {steps.map((step,index)=>(
        <div className="timeline-item" key={index}>
          <div className={completed.includes(step)?"timeline-dot done":"timeline-dot"}/>
          <div>
            <h4>{step}</h4>
            <p>{completed.includes(step)?"Completed":"Pending"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectTimeline;
