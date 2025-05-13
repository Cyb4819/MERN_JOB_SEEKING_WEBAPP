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
        .get(`http://localhost:3000/api/v1/application/employer/getall`, {
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

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
    }
  }, [navigateTo])

  return (
    <section className="jobDetail page">
      <div className="container">
        <div class="job-detail-header">
          <div className="job-details-name">
            <div className="job-name">
              <h1>{job.category}</h1>
            </div>
            <div className="job-details-logo">
              <div className="job-detail-logo-desc">
                <div>
                  <i class="fa-solid fa-building"></i>
                  <span>  google{job.companyname}</span>
                </div>
                <div>
                  <i class="fa-solid fa-location-dot"></i>
                  <span>  {job.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="apply-job-button">
            {(user.role === 'Job Seeker') && <Link to={`/application/${job._id}`}><button>Apply</button></Link>}
          </div>
        </div>
        <div className="banner">
          <p>
            Position: <span> {job.title}</span>
          </p>
          <p>
            Role: <span>{job.category}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>Qualification: <span>{job.qualification}</span></p>
          <p>
            Time Period: <span>{job.timePeriod}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Vacancies: <span>{job.vacancy}</span>
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
          {/*user && user.role == "Employer" && (
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
          )*/}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;