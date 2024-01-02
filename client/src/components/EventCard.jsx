import React from "react";
import { BsDot } from "react-icons/bs";

const EventCard = ({ title, description, location, keywords, start_time, image_link, handleClick, viewModal }) => {
  const keywordsName = keywords !== undefined & keywords.split(/#(.*)/s).length > 1 ? keywords.split(/#(.*)/s)[1].split(',') : [''];
  const dummyDate = new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date(2024, 0, 1).getTime() - new Date(2012, 0, 1).getTime())).toUTCString();
  return (
    <div className="event-card">
      <div className="event-card-details" onClick={() => viewModal({ title, description, location, keywords, start_time, image_link })}>
        <div className="event-group">
          <div className="title">
            <h3>{title}</h3>
          </div>
          <div className="card-heading">
            <BsDot /> <p>{location}</p> <BsDot />
          </div>
        </div>
        <div>
          <img src={image_link}></img>
        </div>
        <div className="keywords">
          {keywordsName.length > 1 ? ('#' + keywordsName.slice(0,5).map((keyword) => (
            keyword
          ))) + ", ...":""}
        </div>
      </div>
      <div className="event-time">
        <p>Event starts</p>
        <p>{start_time ? start_time : dummyDate}</p>
      </div>
    </div>
  );
};

export default EventCard;
