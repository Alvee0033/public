import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { instance } from "@/lib/axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import useSWR from "swr";
import * as Yup from "yup";

const ContactInfoForm = ({ onDataChange, initialData }) => {
    // Fetch data using SWR
    const { data: countries = [] } = useSWR(
        "/master-countries",
        (url) => instance.get(url, { skipErrorLog: true }).then((res) => res?.data?.data || [])
    );
    const { data: zones = [] } = useSWR(
        "/master-time-zones",
        (url) =>
            instance.get(url, { skipErrorLog: true }).then((res) => {
                const items = res?.data?.data || [];
                return items.map((zone) => ({
                    id: zone.id,
                    name: zone.timezone_name || zone.name || "Timezone",
                }));
            })
    );
    const { data: companies = [] } = useSWR(
        "/crm-companies",
        (url) => instance.get(url, { skipErrorLog: true }).then((res) => res?.data?.data || [])
    );
    const { data: contactTypes = [] } = useSWR(
        "/master-contact-types",
        (url) => instance.get(url, { skipErrorLog: true }).then((res) => res?.data?.data || [])
    );

    // Define validation schema with Yup
    const validationSchema = Yup.object({
        first_name: Yup.string().required("First name is required"),
        last_name: Yup.string(),
        job_title: Yup.string(),
        company_name: Yup.string(),
        full_address: Yup.string(),
        address: Yup.string(),
        zip_code: Yup.string(),
        city: Yup.string(),
        date_of_birth: Yup.date(),
        tax_or_ssn: Yup.string(),
        mobile: Yup.string(),
        sms_subscribed: Yup.boolean(),
        whatsapp_number: Yup.boolean(),
        personal_email: Yup.string()
            .email("Invalid email address").required("Personal email is required"),
        personal_email_verified: Yup.boolean(),
        personal_email_subscribed: Yup.boolean(),
        business_email: Yup.string()
            .email("Invalid email address"),
        business_email_verified: Yup.boolean(),
        business_email_subscribed: Yup.boolean(),
        years_of_experience: Yup.string(),
        summary: Yup.string(),
        public_profile: Yup.string(),
        internal_profile_and_tags: Yup.string(),
        facebook: Yup.string(),
        linkedin: Yup.string(),
        twitter_x: Yup.string(),
        profile_picture: Yup.string(),
        public_profile_url: Yup.string(),
        verified: Yup.boolean(),
        internal_notes: Yup.string(),
        archive: Yup.boolean(),
        active_or_passive: Yup.boolean(),
        referred_by_email: Yup.string().email("Invalid email address"),
        company: Yup.number().nullable(),
        state: Yup.number().nullable(),
        country: Yup.number().nullable(),
        verified_by_user: Yup.number().nullable(),
        master_contact_type: Yup.number().nullable(),
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            job_title: "",
            company_name: "",
            full_address: "",
            address: "",
            zip_code: "",
            city: "",
            date_of_birth: null,
            tax_or_ssn: "",
            mobile: "",
            sms_subscribed: false,
            whatsapp_number: false,
            personal_email: "",
            personal_email_verified: false,
            personal_email_subscribed: false,
            business_email: "",
            business_email_verified: false,
            business_email_subscribed: false,
            years_of_experience: "",
            summary: "",
            public_profile: "",
            internal_profile_and_tags: "",
            facebook: "",
            linkedin: "",
            twitter_x: "",
            profile_picture: "",
            public_profile_url: "",
            verified: false,
            internal_notes: "",
            archive: false,
            active_or_passive: true,
            referred_by_email: "",
            company: null,
            state: null,
            country: null,
            verified_by_user: null,
            master_contact_type: null,
            ...initialData,
        },
        validationSchema,
    });

    // Update parent component when form data changes
    useEffect(() => {
        // Always provide form data to parent, even if not perfectly valid
        onDataChange(formik.values);
    }, [formik.values, formik.isValid, formik.touched, onDataChange]);

    // Helper for checkbox handling
    const handleCheckboxChange = (fieldName) => {
        formik.setFieldValue(fieldName, !formik.values[fieldName]);
    };

    // Helper for select handling
    const handleSelectChange = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    };

    // Helper for date handling
    const handleDateChange = (date, fieldName) => {
        formik.setFieldValue(fieldName, date);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="first_name"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter first name"
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                        <p className="text-sm text-red-500">{formik.errors.first_name}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter last name"
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                        <p className="text-sm text-red-500">{formik.errors.last_name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                        id="job_title"
                        name="job_title"
                        value={formik.values.job_title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter job title"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                        id="company_name"
                        name="company_name"
                        value={formik.values.company_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter company name"
                    />
                </div>



                <div className="space-y-2">
                    <Label htmlFor="tax_or_ssn">Tax ID / SSN</Label>
                    <Input
                        id="tax_or_ssn"
                        name="tax_or_ssn"
                        value={formik.values.tax_or_ssn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter tax ID or SSN"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Phone</Label>
                    <Input
                        id="mobile"
                        name="mobile"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter mobile phone number"
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                        <p className="text-sm text-red-500">{formik.errors.mobile}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="years_of_experience">Years of Experience</Label>
                    <Input
                        id="years_of_experience"
                        name="years_of_experience"
                        value={formik.values.years_of_experience}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter years of experience"
                    />
                </div>

                {/* Email Information */}
                <div className="space-y-2">
                    <Label htmlFor="personal_email">Personal Email <span className="text-red-500">*</span></Label>
                    <Input
                        id="personal_email"
                        name="personal_email"
                        type="email"
                        value={formik.values.personal_email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter personal email"
                    />
                    {formik.touched.personal_email && formik.errors.personal_email && (
                        <p className="text-sm text-red-500">{formik.errors.personal_email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="business_email">Business Email</Label>
                    <Input
                        id="business_email"
                        name="business_email"
                        type="email"
                        value={formik.values.business_email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter business email"
                    />
                    {formik.touched.business_email && formik.errors.business_email && (
                        <p className="text-sm text-red-500">{formik.errors.business_email}</p>
                    )}
                </div>

                {/* Address Information */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter street address"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="full_address">Full Address</Label>
                    <Input
                        id="full_address"
                        name="full_address"
                        value={formik.values.full_address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter full address"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter city"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                        id="zip_code"
                        name="zip_code"
                        value={formik.values.zip_code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter ZIP code"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Select
                        value={formik.values.state}
                        onValueChange={(value) => handleSelectChange("state", parseInt(value, 10) || 0)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                            {zones.map(zone => (
                                <SelectItem key={zone.id} value={zone.id}>
                                    {zone.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                        value={formik.values.country}
                        onValueChange={(value) => handleSelectChange("country", parseInt(value, 10) || 0)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(country => (
                                <SelectItem key={country.id} value={country.id}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Social Media */}
                <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                        id="facebook"
                        name="facebook"
                        value={formik.values.facebook}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Facebook profile URL"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                        id="linkedin"
                        name="linkedin"
                        value={formik.values.linkedin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="LinkedIn profile URL"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="twitter_x">Twitter/X</Label>
                    <Input
                        id="twitter_x"
                        name="twitter_x"
                        value={formik.values.twitter_x}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Twitter/X profile URL"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="public_profile_url">Public Profile URL</Label>
                    <Input
                        id="public_profile_url"
                        name="public_profile_url"
                        value={formik.values.public_profile_url}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Public profile URL"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="referred_by_email">Referred By (Email)</Label>
                    <Input
                        id="referred_by_email"
                        name="referred_by_email"
                        type="email"
                        value={formik.values.referred_by_email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Email of referrer"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Select
                        value={formik.values.company}
                        onValueChange={(value) => handleSelectChange("company", parseInt(value, 10) || 0)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                            {companies.map(company => (
                                <SelectItem key={company.id} value={company.id}>
                                    {company.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="master_contact_type">Contact Type</Label>
                    <Select
                        value={formik.values.master_contact_type}
                        onValueChange={(value) => handleSelectChange("master_contact_type", parseInt(value, 10) || 0)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select contact type" />
                        </SelectTrigger>
                        <SelectContent>
                            {contactTypes && contactTypes.length > 0 ? (
                                contactTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-1 text-sm text-center text-gray-500">No contact types available</div>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
                <h4 className="text-md font-medium">Profile Information</h4>

                <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                        id="summary"
                        name="summary"
                        value={formik.values.summary}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter summary"
                        className="min-h-[100px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="public_profile">Public Profile</Label>
                    <Textarea
                        id="public_profile"
                        name="public_profile"
                        value={formik.values.public_profile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter public profile information"
                        className="min-h-[100px]"
                    />
                </div>
            </div>

            {/* Communication Preferences */}
            <div className="space-y-4">
                <h4 className="text-md font-medium">Communication Preferences</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="personal_email_subscribed"
                            checked={formik.values.personal_email_subscribed}
                            onCheckedChange={() => handleCheckboxChange("personal_email_subscribed")}
                        />
                        <Label htmlFor="personal_email_subscribed">Personal Email Notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="business_email_subscribed"
                            checked={formik.values.business_email_subscribed}
                            onCheckedChange={() => handleCheckboxChange("business_email_subscribed")}
                        />
                        <Label htmlFor="business_email_subscribed">Business Email Notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sms_subscribed"
                            checked={formik.values.sms_subscribed}
                            onCheckedChange={() => handleCheckboxChange("sms_subscribed")}
                        />
                        <Label htmlFor="sms_subscribed">SMS Notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="whatsapp_number"
                            checked={formik.values.whatsapp_number}
                            onCheckedChange={() => handleCheckboxChange("whatsapp_number")}
                        />
                        <Label htmlFor="whatsapp_number">WhatsApp Notifications</Label>
                    </div>
                </div>
            </div>

            {/* Status Settings */}
            <div className="space-y-4">
                <h4 className="text-md font-medium">Status Settings</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="verified"
                            checked={formik.values.verified}
                            onCheckedChange={() => handleCheckboxChange("verified")}
                        />
                        <Label htmlFor="verified">Verified</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="personal_email_verified"
                            checked={formik.values.personal_email_verified}
                            onCheckedChange={() => handleCheckboxChange("personal_email_verified")}
                        />
                        <Label htmlFor="personal_email_verified">Personal Email Verified</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="business_email_verified"
                            checked={formik.values.business_email_verified}
                            onCheckedChange={() => handleCheckboxChange("business_email_verified")}
                        />
                        <Label htmlFor="business_email_verified">Business Email Verified</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="archive"
                            checked={formik.values.archive}
                            onCheckedChange={() => handleCheckboxChange("archive")}
                        />
                        <Label htmlFor="archive">Archive</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="active_or_passive"
                            checked={formik.values.active_or_passive}
                            onCheckedChange={() => handleCheckboxChange("active_or_passive")}
                        />
                        <Label htmlFor="active_or_passive">Active Contact</Label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoForm;