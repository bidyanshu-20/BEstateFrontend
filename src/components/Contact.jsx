import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setmessage] = useState("");

  const onChange = (e) => {
    setmessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact:
            <span className="font-bold uppercase">{landlord.username}</span> for{" "}
            <span className="font-bold uppercase">{listing.name}</span>
          </p>
          <textarea
            className="w-full outline-none border-1 p-2 rounded shadow-2xl text-white bg-zinc-500"
            placeholder="Enter Your message Here...."
            name="message"
            id="message"
            cols="30"
            rows="2"
            value={message}
            onChange={onChange}
          ></textarea>
          <a
  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${landlord.email}&su=${encodeURIComponent(
    "Regarding " + listing.name
  )}&body=${encodeURIComponent(message)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-slate-700 text-white text-center rounded-lg hover:opacity-95 p-2"
>
  Send Message
</a>


        </div>
      )}
    </div>
  );
};

export default Contact;
