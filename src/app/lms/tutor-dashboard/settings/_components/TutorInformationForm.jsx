import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AutocompleteSelect from "./AutocompleteSelect";
import VerificationBadge from "./VerificationBadge";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const TutorInformationForm = ({ 
  tutorFields, 
  socialMedia, 
  handleTutorFieldChange, 
  handleSocialMediaChange, 
  handleSubmit, 
  loading, 
  error, 
  success,
  tutorData 
}) => {
  if (!tutorData) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-blue-600">
            Tutor Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500">Tutor profile not loaded.</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-blue-600">
            Tutor Information
          </CardTitle>
          <VerificationBadge isVerified={tutorFields.verified_tutor} />
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input type="text" name="name" value={tutorFields.name} onChange={handleTutorFieldChange} placeholder="Full Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <Input type="text" name="job_title" value={tutorFields.job_title} onChange={handleTutorFieldChange} placeholder="Job Title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input type="text" name="company_name" value={tutorFields.company_name} onChange={handleTutorFieldChange} placeholder="Company Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Address</label>
              <Input type="text" name="full_address" value={tutorFields.full_address} onChange={handleTutorFieldChange} placeholder="Full Address" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input type="text" name="address" value={tutorFields.address} onChange={handleTutorFieldChange} placeholder="Address" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <Input type="text" name="zip_code" value={tutorFields.zip_code} onChange={handleTutorFieldChange} placeholder="Zip Code" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input type="text" name="city" value={tutorFields.city} onChange={handleTutorFieldChange} placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <Input type="date" name="date_of_birth" value={tutorFields.date_of_birth} onChange={handleTutorFieldChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax or SSN</label>
              <Input type="text" name="tax_or_ssn" value={tutorFields.tax_or_ssn} onChange={handleTutorFieldChange} placeholder="Tax or SSN" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile</label>
              <PhoneInput
                country={'us'}
                value={tutorFields.mobile}
                onChange={(value) => handleTutorFieldChange({ target: { name: 'mobile', value } })}
                inputProps={{
                  name: 'mobile',
                  required: false,
                  autoFocus: false,
                }}
                inputStyle={{ width: '100%' }}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" name="sms_subscribed" checked={tutorFields.sms_subscribed} onChange={handleTutorFieldChange} />
              <label className="text-sm">SMS Subscribed</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <Input type="text" name="whatsapp_number" value={tutorFields.whatsapp_number} onChange={handleTutorFieldChange} placeholder="WhatsApp Number" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Personal Email</label>
              <Input type="email" name="personal_email" value={tutorFields.personal_email} onChange={handleTutorFieldChange} placeholder="Personal Email" />
            </div>
            {/* Removed Personal Email Verified and Subscribed fields */}
            <div>
              <label className="block text-sm font-medium mb-1">Business Email</label>
              <Input type="email" name="business_email" value={tutorFields.business_email} onChange={handleTutorFieldChange} placeholder="Business Email" />
            </div>
            {/* Removed Business Email Verified and Subscribed fields */}
            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <Input type="text" name="years_of_experience" value={tutorFields.years_of_experience} onChange={handleTutorFieldChange} placeholder="Years of Experience" />
            </div>
            {/* Removed Summary field */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Profile</label>
              <Input type="text" name="full_profile" value={tutorFields.full_profile} onChange={handleTutorFieldChange} placeholder="Full Profile" />
            </div>
            {/* Removed Admin Remarks field */}
            {/* Removed Public URL, Archive, Active Tutor or Passive fields */}
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" name="referred" checked={tutorFields.referred} onChange={handleTutorFieldChange} />
              <label className="text-sm">Referred</label>
            </div>
            {/* Removed Referred By Email field */}
            <div>
              <label className="block text-sm font-medium mb-1">Tutor Since Date</label>
              <Input type="date" name="tutor_since_date" value={tutorFields.tutor_since_date} onChange={handleTutorFieldChange} />
            </div>
            {/* Removed Teach Students, Tutoring Sessions, Rating Score fields */}
            <div>
              <label className="block text-sm font-medium mb-1">County</label>
              <AutocompleteSelect
                apiEndpoint="/master-countries"
                placeholder="Select County"
                value={tutorFields.country}
                onChange={(value) => handleTutorFieldChange({ target: { name: 'country', value } })}
                displayField="name"
                valueField="id"
                selectedObject={tutorData?.country}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <AutocompleteSelect
                apiEndpoint="/master-states"
                placeholder="Select State"
                value={tutorFields.state}
                onChange={(value) => handleTutorFieldChange({ target: { name: 'state', value } })}
                displayField="name"
                valueField="id"
                selectedObject={tutorData?.state}
              />
            </div>
            {/* Social Media Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <Input type="text" name="facebook" value={socialMedia.facebook} onChange={handleSocialMediaChange} placeholder="https://facebook.com/yourprofile" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <Input type="text" name="linked_in" value={socialMedia.linked_in} onChange={handleSocialMediaChange} placeholder="https://linkedin.com/in/yourprofile" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter/X</label>
              <Input type="text" name="twitter_x" value={socialMedia.twitter_x} onChange={handleSocialMediaChange} placeholder="https://twitter.com/yourprofile" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <Input type="text" name="instagram" value={socialMedia.instagram} onChange={handleSocialMediaChange} placeholder="https://instagram.com/yourprofile" />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          <Button type="submit" disabled={loading} className="mt-4 py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {loading ? 'Updating...' : 'Update Tutor Info'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TutorInformationForm;