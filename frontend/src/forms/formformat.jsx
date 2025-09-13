import React, { useState, useEffect } from 'react';
import './formformat.css';

const FormsFormat = ({ onBackClick }) => {
  const [selectedCohort, setSelectedCohort] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [authors, setAuthors] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    if (selectedCohort && Object.keys(formData).length > 0) {
      localStorage.setItem(`draft_${selectedCohort}`, JSON.stringify({ formData, authors }));
    }
  }, [formData, authors, selectedCohort]);

  // Load draft from localStorage
  useEffect(() => {
    if (selectedCohort) {
      const saved = localStorage.getItem(`draft_${selectedCohort}`);
      if (saved) {
        const { formData: savedFormData, authors: savedAuthors } = JSON.parse(saved);
        setFormData(savedFormData || {});
        setAuthors(savedAuthors || []);
      } else {
        setFormData({});
        setAuthors([]);
      }
      setCurrentStep(0);
    }
  }, [selectedCohort]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectMultiple = (name, selectedOptions) => {
    const values = Array.from(selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const addAuthor = () => {
    setAuthors([...authors, { name: '', department: '', email: '', role: 'Author' }]);
  };

  const removeAuthor = (index) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const updateAuthor = (index, field, value) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index][field] = value;
    setAuthors(updatedAuthors);
  };

  const validateStep = (step) => {
    // Basic validation - can be expanded
    if (selectedCohort === 'journal' && step === 0) {
      return formData['publication.title']?.trim();
    }
    if (selectedCohort === 'conference' && step === 0) {
      return formData['publication.title']?.trim();
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      alert('Please fill required fields');
      return;
    }
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTotalSteps = () => {
    if (selectedCohort === 'copyright' || selectedCohort === 'patent') return 1;
    return 3;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trackingId = 'R' + Date.now().toString(36).toUpperCase().slice(-8);
    setToastMessage(`Tracking ID: ${trackingId} — your entry is saved as draft (simulate server submit).`);
    setShowToast(true);
    
    localStorage.setItem('lastSubmission', JSON.stringify({
      id: trackingId,
      submittedAt: new Date().toISOString(),
      cohort: selectedCohort
    }));
    
    localStorage.removeItem(`draft_${selectedCohort}`);
    
    setTimeout(() => {
      setFormData({});
      setAuthors([]);
      setCurrentStep(0);
      setShowToast(false);
    }, 400);
  };

  const renderJournalForm = () => {
    const steps = [
      // Step 1: Basic Info
      <div key="step1" className="form-step">
        <h2>Journal - Basic Info</h2>
        <div className="grid">
          <div className="form-group half">
            <label>Title of Article <span className="req">*</span></label>
            <input 
              type="text" 
              value={formData['publication.title'] || ''} 
              onChange={(e) => handleInputChange('publication.title', e.target.value)}
              required 
            />
          </div>
          <div className="form-group half">
            <label>Indexing Agency (select multiple)</label>
            <select 
              multiple 
              onChange={(e) => handleSelectMultiple('publication.indexing', e.target.selectedOptions)}
            >
              <option value="Scopus">Scopus</option>
              <option value="WebOfScience">Web of Science</option>
              <option value="IndianCitationIndex">Indian Citation Index</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group third">
            <label>Impact Factor</label>
            <input 
              type="text" 
              value={formData['publication.impact_factor'] || ''} 
              onChange={(e) => handleInputChange('publication.impact_factor', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>URL</label>
            <input 
              type="url" 
              placeholder="https://..."
              value={formData['publication.url'] || ''} 
              onChange={(e) => handleInputChange('publication.url', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Language</label>
            <input 
              type="text" 
              value={formData['publication.language'] || ''} 
              onChange={(e) => handleInputChange('publication.language', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Date of Publication</label>
            <input 
              type="date" 
              value={formData['publication.date'] || ''} 
              onChange={(e) => handleInputChange('publication.date', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Name of Journal</label>
            <input 
              type="text" 
              value={formData['journal.name'] || ''} 
              onChange={(e) => handleInputChange('journal.name', e.target.value)}
            />
          </div>
        </div>
      </div>,

      // Step 2: Authors
      <div key="step2" className="form-step">
        <h2>Authors</h2>
        <div className="authors-list">
          {authors.map((author, index) => (
            <div key={index} className="author-row">
              <div className="grid" style={{alignItems: 'center'}}>
                <div className="form-group third">
                  <label>Author Name</label>
                  <input 
                    type="text" 
                    value={author.name} 
                    onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group third">
                  <label>Department</label>
                  <input 
                    type="text" 
                    value={author.department} 
                    onChange={(e) => updateAuthor(index, 'department', e.target.value)}
                  />
                </div>
                <div className="form-group third">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={author.email} 
                    onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                  />
                </div>
                <div className="author-controls">
                  <select 
                    className="author-role" 
                    value={author.role}
                    onChange={(e) => updateAuthor(index, 'role', e.target.value)}
                  >
                    <option value="Author">Author</option>
                    <option value="Corresponding">Corresponding Author</option>
                  </select>
                  <button type="button" className="btn btn-remove" onClick={() => removeAuthor(index)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="form-row">
          <button type="button" className="btn btn-add" onClick={addAuthor}>+ Add Author</button>
        </div>
        <div className="grid">
          <div className="form-group half">
            <label>Sole / Co-Authored</label>
            <select 
              value={formData['publication.sole_coauthored'] || ''} 
              onChange={(e) => handleInputChange('publication.sole_coauthored', e.target.value)}
            >
              <option value="">--</option>
              <option value="Sole">Sole Author</option>
              <option value="CoAuthored">Co-Authored</option>
            </select>
          </div>
          <div className="form-group half">
            <label>No. of Co-Authors</label>
            <input 
              type="number" 
              min="0"
              value={formData['publication.num_coauthors'] || ''} 
              onChange={(e) => handleInputChange('publication.num_coauthors', e.target.value)}
            />
          </div>
        </div>
      </div>,

      // Step 3: Bibliographic & Proof
      <div key="step3" className="form-step">
        <h2>Bibliographic & Verification</h2>
        <div className="grid">
          <div className="form-group third">
            <label>Volume Number</label>
            <input 
              type="text" 
              value={formData['journal.volume'] || ''} 
              onChange={(e) => handleInputChange('journal.volume', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Issue Number</label>
            <input 
              type="text" 
              value={formData['journal.issue'] || ''} 
              onChange={(e) => handleInputChange('journal.issue', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>DOI</label>
            <input 
              type="text" 
              placeholder="10.xxxx/xxxxx"
              value={formData['journal.doi'] || ''} 
              onChange={(e) => handleInputChange('journal.doi', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Pages: From</label>
            <input 
              type="number" 
              value={formData['journal.pages_from'] || ''} 
              onChange={(e) => handleInputChange('journal.pages_from', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Pages: To</label>
            <input 
              type="number" 
              value={formData['journal.pages_to'] || ''} 
              onChange={(e) => handleInputChange('journal.pages_to', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Publisher Name</label>
            <input 
              type="text" 
              value={formData['publication.publisher_name'] || ''} 
              onChange={(e) => handleInputChange('publication.publisher_name', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Publisher Address</label>
            <input 
              type="text" 
              value={formData['publication.publisher_address'] || ''} 
              onChange={(e) => handleInputChange('publication.publisher_address', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Quartile</label>
            <input 
              type="text" 
              placeholder="Q1 / Q2 / Q3 / Q4"
              value={formData['publication.quartile'] || ''} 
              onChange={(e) => handleInputChange('publication.quartile', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Proof (upload or link)</label>
            <div className="file-input-group">
              <input 
                type="url" 
                placeholder="Drive link (optional)"
                value={formData['proof.link'] || ''} 
                onChange={(e) => handleInputChange('proof.link', e.target.value)}
              />
              <input 
                type="file" 
                onChange={(e) => handleInputChange('proof.file', e.target.files[0])}
              />
            </div>
          </div>
          <div className="form-group">
            <label>SDG Goals (select relevant)</label>
            <select 
              multiple 
              onChange={(e) => handleSelectMultiple('publication.sdg', e.target.selectedOptions)}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(num => (
                <option key={num} value={`SDG${num}`}>SDG {num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    ];
    return steps[currentStep];
  };

  const renderConferenceForm = () => {
    const steps = [
      // Step 1: Basic
      <div key="step1" className="form-step">
        <h2>Conference - Basic Info</h2>
        <div className="grid">
          <div className="form-group half">
            <label>Title of Paper <span className="req">*</span></label>
            <input 
              type="text" 
              value={formData['publication.title'] || ''} 
              onChange={(e) => handleInputChange('publication.title', e.target.value)}
              required 
            />
          </div>
          <div className="form-group half">
            <label>Name of Session</label>
            <input 
              type="text" 
              value={formData['conference.session_name'] || ''} 
              onChange={(e) => handleInputChange('conference.session_name', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Organising Institution</label>
            <input 
              type="text" 
              value={formData['conference.organising_institution'] || ''} 
              onChange={(e) => handleInputChange('conference.organising_institution', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Place</label>
            <input 
              type="text" 
              value={formData['conference.place'] || ''} 
              onChange={(e) => handleInputChange('conference.place', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Start Date</label>
            <input 
              type="date" 
              value={formData['conference.start_date'] || ''} 
              onChange={(e) => handleInputChange('conference.start_date', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>End Date</label>
            <input 
              type="date" 
              value={formData['conference.end_date'] || ''} 
              onChange={(e) => handleInputChange('conference.end_date', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Level</label>
            <select 
              value={formData['conference.level'] || ''} 
              onChange={(e) => handleInputChange('conference.level', e.target.value)}
            >
              <option value="">--</option>
              <option value="Local">Local</option>
              <option value="National">National</option>
              <option value="International">International</option>
            </select>
          </div>
          <div className="form-group">
            <label>Proof (URL/File)</label>
            <div className="file-input-group">
              <input 
                type="url" 
                placeholder="https://..."
                value={formData['proof.link'] || ''} 
                onChange={(e) => handleInputChange('proof.link', e.target.value)}
              />
              <input 
                type="file" 
                onChange={(e) => handleInputChange('proof.file', e.target.files[0])}
              />
            </div>
          </div>
        </div>
      </div>,

      // Step 2: Authors (same as journal)
      <div key="step2" className="form-step">
        <h2>Authors</h2>
        <div className="authors-list">
          {authors.map((author, index) => (
            <div key={index} className="author-row">
              <div className="grid" style={{alignItems: 'center'}}>
                <div className="form-group third">
                  <label>Author Name</label>
                  <input 
                    type="text" 
                    value={author.name} 
                    onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group third">
                  <label>Department</label>
                  <input 
                    type="text" 
                    value={author.department} 
                    onChange={(e) => updateAuthor(index, 'department', e.target.value)}
                  />
                </div>
                <div className="form-group third">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={author.email} 
                    onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                  />
                </div>
                <div className="author-controls">
                  <select 
                    className="author-role" 
                    value={author.role}
                    onChange={(e) => updateAuthor(index, 'role', e.target.value)}
                  >
                    <option value="Author">Author</option>
                    <option value="Corresponding">Corresponding Author</option>
                  </select>
                  <button type="button" className="btn btn-remove" onClick={() => removeAuthor(index)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="form-row">
          <button type="button" className="btn btn-add" onClick={addAuthor}>+ Add Author</button>
        </div>
      </div>,

      // Step 3: Metadata
      <div key="step3" className="form-step">
        <h2>Metadata & Extra</h2>
        <div className="grid">
          <div className="form-group half">
            <label>Other Academician</label>
            <input 
              type="text" 
              value={formData['publication.other_academician'] || ''} 
              onChange={(e) => handleInputChange('publication.other_academician', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>International Collaboration</label>
            <select 
              value={formData['publication.international_collab'] || ''} 
              onChange={(e) => handleInputChange('publication.international_collab', e.target.value)}
            >
              <option value="">--</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>Area / Keywords</label>
            <input 
              type="text" 
              value={formData['publication.area'] || ''} 
              onChange={(e) => handleInputChange('publication.area', e.target.value)}
            />
          </div>
        </div>
      </div>
    ];
    return steps[currentStep];
  };

  const renderBookForm = () => {
    const steps = [
      // Step 1: Basic
      <div key="step1" className="form-step">
        <h2>Book / Book Chapter - Basic</h2>
        <div className="grid">
          <div className="form-group half">
            <label>Book Type</label>
            <select 
              value={formData['book.book_type'] || ''} 
              onChange={(e) => handleInputChange('book.book_type', e.target.value)}
            >
              <option value="">--</option>
              <option value="Book">Book</option>
              <option value="Book Chapter">Book Chapter</option>
            </select>
          </div>
          <div className="form-group half">
            <label>Title of Book</label>
            <input 
              type="text" 
              value={formData['book.title'] || ''} 
              onChange={(e) => handleInputChange('book.title', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Title of Chapter / Article</label>
            <input 
              type="text" 
              value={formData['book.chapter_title'] || ''} 
              onChange={(e) => handleInputChange('book.chapter_title', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>ISBN</label>
            <input 
              type="text" 
              value={formData['book.isbn'] || ''} 
              onChange={(e) => handleInputChange('book.isbn', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Editor Name</label>
            <input 
              type="text" 
              value={formData['book.editor'] || ''} 
              onChange={(e) => handleInputChange('book.editor', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Pages (From - To)</label>
            <div className="small-grid">
              <input 
                type="number" 
                placeholder="From"
                value={formData['book.pages_from'] || ''} 
                onChange={(e) => handleInputChange('book.pages_from', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="To"
                value={formData['book.pages_to'] || ''} 
                onChange={(e) => handleInputChange('book.pages_to', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group half">
            <label>Publishing Company / Institution</label>
            <input 
              type="text" 
              value={formData['book.publisher'] || ''} 
              onChange={(e) => handleInputChange('book.publisher', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Total Pages</label>
            <input 
              type="number" 
              value={formData['book.total_pages'] || ''} 
              onChange={(e) => handleInputChange('book.total_pages', e.target.value)}
            />
          </div>
        </div>
      </div>,

      // Step 2: Authors (same structure)
      <div key="step2" className="form-step">
        <h2>Authors</h2>
        <div className="authors-list">
          {authors.map((author, index) => (
            <div key={index} className="author-row">
              <div className="grid" style={{alignItems: 'center'}}>
                <div className="form-group third">
                  <label>Author Name</label>
                  <input 
                    type="text" 
                    value={author.name} 
                    onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group third">
                  <label>Department</label>
                  <input 
                    type="text" 
                    value={author.department} 
                    onChange={(e) => updateAuthor(index, 'department', e.target.value)}
                  />
                </div>
                <div className="form-group third">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={author.email} 
                    onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                  />
                </div>
                <div className="author-controls">
                  <select 
                    className="author-role" 
                    value={author.role}
                    onChange={(e) => updateAuthor(index, 'role', e.target.value)}
                  >
                    <option value="Author">Author</option>
                    <option value="Corresponding">Corresponding Author</option>
                  </select>
                  <button type="button" className="btn btn-remove" onClick={() => removeAuthor(index)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="form-row">
          <button type="button" className="btn btn-add" onClick={addAuthor}>+ Add Author</button>
        </div>
      </div>,

      // Step 3: Extras
      <div key="step3" className="form-step">
        <h2>Extras</h2>
        <div className="grid">
          <div className="form-group half">
            <label>Month & Year</label>
            <input 
              type="month" 
              value={formData['book.month_year'] || ''} 
              onChange={(e) => handleInputChange('book.month_year', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>URL</label>
            <input 
              type="url" 
              value={formData['book.url'] || ''} 
              onChange={(e) => handleInputChange('book.url', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Proof (file/link)</label>
            <div className="file-input-group">
              <input 
                type="file" 
                onChange={(e) => handleInputChange('proof.file', e.target.files[0])}
              />
              <input 
                type="url" 
                placeholder="Drive link"
                value={formData['proof.link'] || ''} 
                onChange={(e) => handleInputChange('proof.link', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    ];
    return steps[currentStep];
  };

  const renderCopyrightForm = () => {
    return (
      <div className="form-step">
        <h2>Copyright Registration</h2>
        <div className="grid">
          <div className="form-group half">
            <label>Title of the Work</label>
            <input 
              type="text" 
              value={formData['copyright.title'] || ''} 
              onChange={(e) => handleInputChange('copyright.title', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Class & Description</label>
            <input 
              type="text" 
              value={formData['copyright.class_description'] || ''} 
              onChange={(e) => handleInputChange('copyright.class_description', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Registration Number</label>
            <input 
              type="text" 
              value={formData['copyright.registration_number'] || ''} 
              onChange={(e) => handleInputChange('copyright.registration_number', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Name of Applicants</label>
            <input 
              type="text" 
              value={formData['copyright.applicants'] || ''} 
              onChange={(e) => handleInputChange('copyright.applicants', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Date of Application</label>
            <input 
              type="date" 
              value={formData['copyright.date_application'] || ''} 
              onChange={(e) => handleInputChange('copyright.date_application', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Date of Publication</label>
            <input 
              type="date" 
              value={formData['copyright.date_publication'] || ''} 
              onChange={(e) => handleInputChange('copyright.date_publication', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Language of the Work</label>
            <input 
              type="text" 
              value={formData['copyright.language'] || ''} 
              onChange={(e) => handleInputChange('copyright.language', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Proof (file/link)</label>
            <div className="file-input-group">
              <input 
                type="file" 
                onChange={(e) => handleInputChange('proof.file', e.target.files[0])}
              />
              <input 
                type="url" 
                placeholder="Drive link"
                value={formData['proof.link'] || ''} 
                onChange={(e) => handleInputChange('proof.link', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPatentForm = () => {
    return (
      <div className="form-step">
        <h2>Patent Details</h2>
        <div className="grid">
          <div className="form-group half">
            <label>Title</label>
            <input 
              type="text" 
              value={formData['patent.title'] || ''} 
              onChange={(e) => handleInputChange('patent.title', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Applicant(s)</label>
            <input 
              type="text" 
              value={formData['patent.applicants'] || ''} 
              onChange={(e) => handleInputChange('patent.applicants', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Co-Applicant(s)</label>
            <input 
              type="text" 
              value={formData['patent.coapplicants'] || ''} 
              onChange={(e) => handleInputChange('patent.coapplicants', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Department</label>
            <input 
              type="text" 
              value={formData['patent.department'] || ''} 
              onChange={(e) => handleInputChange('patent.department', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Registration Date</label>
            <input 
              type="date" 
              value={formData['patent.registration_date'] || ''} 
              onChange={(e) => handleInputChange('patent.registration_date', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Registration No</label>
            <input 
              type="text" 
              value={formData['patent.registration_number'] || ''} 
              onChange={(e) => handleInputChange('patent.registration_number', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Filing Date</label>
            <input 
              type="date" 
              value={formData['patent.filing_date'] || ''} 
              onChange={(e) => handleInputChange('patent.filing_date', e.target.value)}
            />
          </div>
          <div className="form-group half">
            <label>Granted Date</label>
            <input 
              type="date" 
              value={formData['patent.granted_date'] || ''} 
              onChange={(e) => handleInputChange('patent.granted_date', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Patent Number</label>
            <input 
              type="text" 
              value={formData['patent.patent_number'] || ''} 
              onChange={(e) => handleInputChange('patent.patent_number', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>Royalty Received</label>
            <input 
              type="text" 
              value={formData['patent.royalty'] || ''} 
              onChange={(e) => handleInputChange('patent.royalty', e.target.value)}
            />
          </div>
          <div className="form-group third">
            <label>IPC Classification (IPC No.)</label>
            <input 
              type="text" 
              value={formData['patent.ipc'] || ''} 
              onChange={(e) => handleInputChange('patent.ipc', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Field of Invention</label>
            <input 
              type="text" 
              value={formData['patent.field'] || ''} 
              onChange={(e) => handleInputChange('patent.field', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Proof (file/link)</label>
            <div className="file-input-group">
              <input 
                type="file" 
                onChange={(e) => handleInputChange('proof.file', e.target.files[0])}
              />
              <input 
                type="url" 
                placeholder="link"
                value={formData['proof.link'] || ''} 
                onChange={(e) => handleInputChange('proof.link', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentForm = () => {
    switch (selectedCohort) {
      case 'journal': return renderJournalForm();
      case 'conference': return renderConferenceForm();
      case 'book': return renderBookForm();
      case 'copyright': return renderCopyrightForm();
      case 'patent': return renderPatentForm();
      default: return null;
    }
  };

  const totalSteps = getTotalSteps();

  return (
    <div className={`forms-format ${isDark ? 'dark' : ''}`}>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            {onBackClick && (
              <button className="btn btn-back" onClick={onBackClick}>
                ← Back to Dashboard
              </button>
            )}
          </div>
          <div className="topbar-center">
            <h1>Research / Publication Submission</h1>
          </div>
          <div className="topbar-right">
            <button 
              className="btn btn-small" 
              onClick={() => setIsDark(!isDark)}
            >
              Toggle Dark
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="selector-card">
          <label><strong>Select Cohort / Category</strong></label>
          <select 
            value={selectedCohort} 
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="cohort-select"
          >
            <option value="">-- Choose --</option>
            <option value="journal">Journal</option>
            <option value="conference">Conference</option>
            <option value="book">Book / Book Chapter</option>
            <option value="copyright">Copyright</option>
            <option value="patent">Patent</option>
          </select>
          <small className="muted">Only fields relevant to the chosen cohort will load.</small>
        </div>

        <div className="app-shell">
          {!selectedCohort ? (
            <div className="placeholder">
              <p>Select a cohort above to load the form.</p>
            </div>
          ) : (
            <section className="form-wrapper">
              <form onSubmit={handleSubmit} noValidate>
                {totalSteps > 1 && (
                  <div className="progress-row">
                    <div className="progress">
                      <div 
                        className="progress-fill" 
                        style={{width: `${Math.round(((currentStep + 1) / totalSteps) * 100)}%`}}
                      />
                    </div>
                    <div className="progress-text">Step {currentStep + 1} / {totalSteps}</div>
                  </div>
                )}

                {renderCurrentForm()}

                <div className="form-nav">
                  {currentStep > 0 && (
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      ← Back
                    </button>
                  )}
                  {currentStep < totalSteps - 1 ? (
                    <button type="button" className="btn btn-next" onClick={nextStep}>
                      Next →
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}
        </div>
      </main>

      {/* Toast */}
      {showToast && (
        <>
          <div className="overlay" onClick={() => setShowToast(false)} />
          <div className="toast">
            <h3>Submission Successful</h3>
            <p>{toastMessage}</p>
            <div className="toast-actions">
              <button className="btn btn-secondary" onClick={() => setShowToast(false)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormsFormat;