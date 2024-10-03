import { Link } from "react-router-dom";

const JobListings = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div key={job._id} className="job-preview">
          <Link to={`/jobs/${job._id}`}>
            <h2>{job.title}</h2>
          </Link>
          <p>Type: {job.type}</p>
          <p>Company: {job.company.name}</p>
        </div>
      ))}
    </div>
  );
};

export default JobListings;
