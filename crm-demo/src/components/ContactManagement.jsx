import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
// Contact Management Component
const ContactManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [contacts, setContacts] = useState([
    // {
    //   id: 1,
    //   name: "John Doe",
    //   email: "john@example.com",
    //   phone: "123-456-7890",
    //   company: "ABC Corp",
    //   status: "Lead",
    // },
    // {
    //   id: 2,
    //   name: "Jane Smith",
    //   email: "jane@example.com",
    //   phone: "987-654-3210",
    //   company: "XYZ Inc",
    //   status: "Client",
    // },
    // {
    //   id: 3,
    //   name: "Alice Johnson",
    //   email: "alice@example.com",
    //   phone: "456-789-1234",
    //   company: "ABC Corp",
    //   status: "Lead",
    // },
    // {
    //   id: 4,
    //   name: "Bob Brown",
    //   email: "bob@example.com",
    //   phone: "321-654-9870",
    //   company: "XYZ Inc",
    //   status: "Lead",
    // },
  ]);

  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);

  const [currentContact, setCurrentContact] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const server = import.meta.env.VITE_API_URL;

  // / Fetch contacts from the backend on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${server}/api/contacts`);
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);
  // Filter Contacts based on search and selected category
  const filteredContacts = contacts.filter(
    (contact) =>
      (contact?.name?.toLowerCase().includes(search?.toLowerCase()) ||
        contact?.company?.toLowerCase().includes(search?.toLowerCase())) &&
      (filter === "All" || contact?.status === filter)
  );

  // Handle Delete Contact
  const handleDeleteContact = async (id) => {
    try {
      // Log the id for debugging purposes
      console.log('id cont==>', id);
      
      // API call to delete the contact from the backend
      await axios.delete(`${server}/api/contacts/${id}`);
      
      // Remove the contact from the local state after successful deletion
      setContacts(contacts.filter((contact) => contact._id !== id));
  
      // Close the delete dialog
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };
  

  // Add new contact
  // const handleAddContact = (newContact) => {
  //   setContacts([...contacts, { id: contacts.length + 1, ...newContact }]);
  //   setIsAddPanelOpen(false);
  // };

  // Function to add a new contact
  const handleAddContact = async (contact) => {
    try {
      const response = await axios.post(`${server}/api/contacts`, contact);
      console.log("Contact added:", response.data);
      // Fetch the updated list of contacts
      const updatedContacts = await axios.get(`${server}/api/contacts`);
      setContacts(updatedContacts.data); // Update the list with new contact
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };
  // Edit contact
  // const handleEditContact = (updatedContact) => {
  //   setContacts(
  //     contacts.map((contact) =>
  //       contact.id === currentContact.id ? updatedContact : contact
  //     )
  //   );
  //   setIsEditPanelOpen(false);
  // };



  // Function to handle the contact edit with API call
// Handle the form submission and API call to update the contact
const handleEditContact = async (updatedContact) => {
  try {
    const response = await axios.put(`${server}/api/contacts/${updatedContact.id}`, updatedContact);
    
    // Update contacts state with the new contact data
    setContacts(
      contacts.map((contact) =>
        contact._id === updatedContact.id ? response.data.contact : contact
      )
    );
    setIsEditPanelOpen(false); // Close the edit panel
  } catch (error) {
    console.error("Error updating contact:", error);
  }
};

  const handleViewContact = (updatedContact) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === currentContact.id ? updatedContact : contact
      )
    );
    setIsViewPanelOpen(false);
  };

  return (
    <div className="p-6 flex flex-col space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 w-full md:w-2/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Contacts"
            className="border border-gray-300 p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          >
            <option value="All">All</option>
            <option value="Lead">Lead</option>
            <option value="Client">Client</option>
          </select>
        </div>
        <button
          onClick={() => setIsAddPanelOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-sm"
        >
          Add Contact
        </button>
      </div>

      {/* Contact Table */}
      <div className="overflow-x-auto shadow-lg bg-white rounded-lg">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-4 text-gray-600 w-[20%]">Name</th>
              <th className="py-4 px-4 text-gray-600 w-[20%]">Email</th>
              <th className="py-4 px-4 text-gray-600 w-[20%]">Phone</th>
              <th className="py-4 px-4 text-gray-600 w-[20%]">Company</th>
              <th className="py-4 px-4 text-gray-600 w-[20%]">Status</th>
              <th className="py-4 px-4 text-gray-600 w-[20%] text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => (
              <tr
                key={contact._id}
                className={`border-b hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-4 capitalize">{contact.name}</td>
                <td className="py-4 px-4">{contact.email}</td>
                <td className="py-4 px-4">{contact.phone}</td>
                <td className="py-4 px-4 capitalize">{contact.company}</td>
                <td className="py-4 px-4">{contact.status}</td>
                <td className="py-4 px-4 flex space-x-4">
                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setCurrentContact(contact);
                      setIsEditPanelOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-100 transition duration-300"
                  >
                    Edit
                  </button>
                  {/* View Button */}
                  <button
                    onClick={() => {
                      setCurrentContact(contact);
                      setIsViewPanelOpen(true);
                    }}
                    className="text-green-600 hover:text-green-800 font-medium px-4 py-2 rounded-md border border-green-600 hover:bg-green-100 transition duration-300"
                  >
                    View
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      setIsDeleteDialogOpen(true);
                      setContactToDelete(contact);
                    }}
                    className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-md border border-red-600 hover:bg-red-100 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contact Slide Panel */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity ${
          isAddPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsAddPanelOpen(false)}
      ></div>

      <div
        className={`fixed right-0 top-0 w-96 bg-white h-full shadow-lg p-6 transform transition-transform ${
          isAddPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsAddPanelOpen(false)} // Close the panel when clicked
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <CloseIcon />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
        <ContactForm onSubmit={handleAddContact} />
      </div>

      {/* View Details */}
      <div
        className={`fixed right-0 top-0 w-96 bg-white h-full shadow-lg p-6 transform transition-transform ${
          isViewPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsViewPanelOpen(false)} // Close the panel when clicked
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <CloseIcon />
        </button>
        <h2 className="text-xl font-semibold mb-4">View Contact</h2>
        {currentContact && <ViewDetails contact={currentContact} />}
      </div>

      {/* Edit Contact Slide Panel */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity ${
          isEditPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsEditPanelOpen(false)}
      ></div>

      <div
        className={`fixed right-0 top-0 w-96 bg-white h-full shadow-lg p-6 transform transition-transform ${
          isEditPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsEditPanelOpen(false)} // Close the panel when clicked
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <CloseIcon />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Contact</h2>
        {currentContact && (
          <EditForm contact={currentContact} onSubmit={handleEditContact} />
        )}
      </div>

      {/* Delete Confirmation */}
      {isDeleteDialogOpen && contactToDelete && (
        <DeleteConfirmation
          contact={contactToDelete}
          onDelete={() => handleDeleteContact(contactToDelete._id)}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
};

// Add Contact Form Component
const ContactForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Lead");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, company, status });
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Lead">Lead</option>
            <option value="Client">Client</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4"
        >
          Save Contact
        </button>
      </div>
    </form>
  );
};

// View Details Component
const ViewDetails = ({ contact }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-600 font-medium">Name</label>
        <div className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 text-gray-700">
          {contact ? contact.name : "N/A"}
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Email</label>
        <div className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 text-gray-700">
          {contact ? contact.email : "N/A"}
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Phone</label>
        <div className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 text-gray-700">
          {contact ? contact.phone : "N/A"}
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Company</label>
        <div className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 text-gray-700">
          {contact ? contact.company : "N/A"}
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Status</label>
        <div className="border border-gray-300 p-3 rounded-md w-full bg-gray-100 text-gray-700">
          {contact ? contact.status : "Lead"}
        </div>
      </div>
    </div>
  );
};

// Edit Form Component
// const EditForm = ({ contact, onSubmit }) => {
//   const [name, setName] = useState(contact.name);
//   const [email, setEmail] = useState(contact.email);
//   const [phone, setPhone] = useState(contact.phone);
//   const [company, setCompany] = useState(contact.company);
//   const [status, setStatus] = useState(contact.status);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ id: contact._id, name, email, phone, company, status });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <div>
//           <label
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="phone"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Phone
//           </label>
//           <input
//             type="text"
//             id="phone"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="company"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Company
//           </label>
//           <input
//             type="text"
//             id="company"
//             value={company}
//             onChange={(e) => setCompany(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="status"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Status
//           </label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           >
//             <option value="Lead">Lead</option>
//             <option value="Client">Client</option>
//           </select>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4"
//         >
//           Save Changes
//         </button>
//       </div>
//     </form>
//   );
// };
const EditForm = ({ contact, onSubmit }) => {
  const [name, setName] = useState(contact.name);
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [company, setCompany] = useState(contact.company);
  const [status, setStatus] = useState(contact.status);

  // Initialize the form fields when the contact changes
  useEffect(() => {
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
    setCompany(contact.company);
    setStatus(contact.status);
  }, [contact]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass the updated contact data with the id back to the parent component
    onSubmit({ id: contact._id, name, email, phone, company, status });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Lead">Lead</option>
            <option value="Client">Client</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4"
        >
          Save Changes
        </button>
      </div>
    </form>
  )}

const DeleteConfirmation = ({ onDelete, onCancel }) => {
  return (
    <div
      id="deleteModal"
      tabIndex="-1"
      // aria-hidden="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        {/* Modal content */}
        <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <button
            type="button"
            className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onCancel} // Close the modal when clicked
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <svg
            className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="mb-4 text-gray-500 dark:text-gray-300">
            Are you sure you want to delete this item?
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => {
                onCancel(); // Perform the cancel action
                // cl(); // Close the modal
              }}
              type="button"
              className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
            <button
              onClick={() => {
                onDelete(); // Perform the delete action
                onCancel();
                // closeModal(); // Close the modal after deletion
              }}
              type="submit"
              className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// );
// };

export default ContactManagement;
