import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [applications, setApplications] = useState([]);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });

    if (user && user.role === "Employer") {
      axios
        .get(`http://localhost:3000/api/v1/application/job/${id}`, {
          withCredentials: true,
        })
        .then((res) => setApplications(res.data.applications))
        .catch((error) => toast.error(error.response.data.message));
    }
  }, [id, user]);

  const handleStatusChange = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/application/update-status/${applicationId}`,
        { status },
        { withCredentials: true }
      );
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
      toast.success(`Application ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span> {job.title}</span>
          </p>
          <p>
            Category: <span>{job.category}</span>
          </p>
          <p>
            Country: <span>{job.country}</span>
          </p>
          <p>
            City: <span>{job.city}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span>{job.jobPostedOn}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <div className="applications">
              <h4>Applications</h4>
              {applications.length > 0 ? (
                applications.map(app => (
                  <div key={app._id} className="application">
                    <p>{app.name}</p>
                    <p>{app.status}</p>
                    <button onClick={() => handleStatusChange(app._id, "Hired")}>
                      Select
                    </button>
                    <button onClick={() => handleStatusChange(app._id, "Rejected")}>
                      Reject
                    </button>
                  </div>
                ))
              ) : (
                <p>No applications yet</p>
              )}
            </div>
          ) : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;