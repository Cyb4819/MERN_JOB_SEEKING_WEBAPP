import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import logo from "../../../public/jobharbor-logo.png";

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "-----",
      subTitle: "Live Job",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "----",
      subTitle: "Companies",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: "----",
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "----",
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];
  return (
    <>
      <div className="heroSection">
        <div className="container">
          <div className="title">
            <h1>Find a job that suits</h1>
            <h1>your interests and skills</h1>
            <p>
              Job search platform matching candidates with ideal roles
              and companies perfectly, sparking passion
              and aligning with interests, skills, and values!
            </p>
          </div>
          <div className="image">
            <img src={logo} alt="hero" />
          </div>
        </div>
        <div className="details">
          {details.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="icon">{element.icon}</div>
                <div className="content">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
