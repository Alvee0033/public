import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { instance } from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import * as Yup from "yup";

const UserInfoForm = ({ onDataChange, initialData }) => {
    // Use refs to track if we've initiated data changes
    const hasInitializedRef = useRef(false);
    const lastReportedValuesRef = useRef(null);

    // Fetch countries and time zones from existing master resources
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
    const { data: roles = [] } = useSWR(
        "/roles/public-signup",
        async (url) => {
            const res = await instance.get(url);
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        }
    );

    const guardianRoleId = roles.find((role) => role.name === "Guardian")?.id || 0;

    // Validation schema updated to match API requirements
    const validationSchema = Yup.object({
        username: Yup.string()
            .min(5, "Username must be at least 5 characters")
            .required("Username is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
        email: Yup.string()
            .email("Email is invalid")
            .required("Email is required"),
        first_name: Yup.string()
            .required("First name is required"),
        last_name: Yup.string(),
        phone_number: Yup.string()
            .matches(/^[0-9+\-\s()]*$/, "Phone number can only contain digits, spaces and + - ( )"),
        master_country: Yup.number(),
        zone: Yup.number(),
        primary_role: Yup.number(),
        // Additional fields aligned with the API schema
        active_or_archive: Yup.boolean().default(true),
        email_confirmed: Yup.boolean().default(true),
        account_lock: Yup.boolean().default(false),
        phone_number_confirmed: Yup.boolean().default(false),
        two_factor_enabled: Yup.boolean().default(false),
        lockout_enabled: Yup.boolean().default(true),
        whatsapp_subscribed: Yup.boolean().default(false),
        email_subscribed: Yup.boolean().default(true),
        sms_subscribed: Yup.boolean().default(false)
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: initialData || {
            username: "",
            password: "",
            email: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            master_country: 0,
            zone: 0,
            primary_role: 0,
            active_or_archive: true,
            email_confirmed: true,
            account_lock: false,
            phone_number_confirmed: false,
            two_factor_enabled: false,
            lockout_enabled: true,
            whatsapp_subscribed: false,
            email_subscribed: true,
            sms_subscribed: false
        },
        validationSchema,
        onSubmit: () => { },
        enableReinitialize: false // Crucial to prevent update loops
    });

    // IMPORTANT: This effect pattern breaks the infinite loop
    useEffect(() => {
        // Initialization phase
        if (initialData && !hasInitializedRef.current) {
            formik.setValues(initialData);
            hasInitializedRef.current = true;
            return;
        }

        // Prevent unnecessary updates - only call onDataChange if values
        // have actually changed and are different from last reported values
        const currentValues = formik.values;
        const currentJSON = JSON.stringify(currentValues);
        const lastJSON = JSON.stringify(lastReportedValuesRef.current);

        if (
            formik.dirty &&
            Object.keys(formik.touched).length > 0 &&
            currentJSON !== lastJSON
        ) {
            // Store values before reporting them
            lastReportedValuesRef.current = JSON.parse(currentJSON);

            // Only report if the form is valid
            if (formik.isValid) {
                // Use timeout to break any potential update cycles
                setTimeout(() => {
                    onDataChange(currentValues);
                }, 0);
            } else {
                setTimeout(() => {
                    onDataChange(null);
                }, 0);
            }
        }
    }, [formik.values, formik.dirty, formik.isValid, formik.touched]);

    useEffect(() => {
        if (!hasInitializedRef.current && guardianRoleId && !formik.values.primary_role) {
            formik.setFieldValue("primary_role", guardianRoleId, false);
        }
    }, [guardianRoleId, formik]);

    // Custom handlers for non-standard inputs
    const handleSelectChange = (name, value) => {
        formik.setFieldValue(name, value);
    };

    const handleSwitchChange = (name) => {
        formik.setFieldValue(name, !formik.values[name]);
    };

    const handleNumberChange = (name, value) => {
        formik.setFieldValue(name, parseInt(value, 10) || 0);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">User Account Information</h3>
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
                    <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                    <Input
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter username"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <p className="text-sm text-red-500">{formik.errors.username}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter email address"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">{formik.errors.email}</p>
                    )}
                </div>

                {/* Password Fields */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500">{formik.errors.password}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                        id="phone_number"
                        name="phone_number"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter phone number"
                    />
                    {formik.touched.phone_number && formik.errors.phone_number && (
                        <p className="text-sm text-red-500">{formik.errors.phone_number}</p>
                    )}
                </div>


                {/* Location Information */}
                <div className="space-y-2">
                    <Label htmlFor="master_country">Country</Label>
                    <Select
                        value={formik.values.master_country.toString()}
                        onValueChange={(value) => handleNumberChange("master_country", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.length > 0 ? (
                                countries.map((country) => (
                                    <SelectItem key={country.id} value={country.id.toString()}>
                                        {country.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="0">Loading countries...</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="zone">Learning Hub</Label>
                    <Select
                        value={formik.values.zone.toString()}
                        onValueChange={(value) => handleNumberChange("zone", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select learning hub" />
                        </SelectTrigger>
                        <SelectContent>
                            {zones.length > 0 ? (
                                zones.map((zone) => (
                                    <SelectItem key={zone.id} value={zone.id.toString()}>
                                        {zone.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="0">Loading learning hubs...</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Account Status Settings */}
            <div className="space-y-4">
                <h4 className="text-md font-medium">Account Status</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="active_or_archive">Active Account</Label>
                        <Switch
                            id="active_or_archive"
                            checked={formik.values.active_or_archive}
                            onCheckedChange={() => handleSwitchChange("active_or_archive")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="email_confirmed">Email Confirmed</Label>
                        <Switch
                            id="email_confirmed"
                            checked={formik.values.email_confirmed}
                            onCheckedChange={() => handleSwitchChange("email_confirmed")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="phone_number_confirmed">Phone Number Confirmed</Label>
                        <Switch
                            id="phone_number_confirmed"
                            checked={formik.values.phone_number_confirmed}
                            onCheckedChange={() => handleSwitchChange("phone_number_confirmed")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="account_lock">Account Locked</Label>
                        <Switch
                            id="account_lock"
                            checked={formik.values.account_lock}
                            onCheckedChange={() => handleSwitchChange("account_lock")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="two_factor_enabled">Two-Factor Authentication</Label>
                        <Switch
                            id="two_factor_enabled"
                            checked={formik.values.two_factor_enabled}
                            onCheckedChange={() => handleSwitchChange("two_factor_enabled")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="lockout_enabled">Lockout Enabled</Label>
                        <Switch
                            id="lockout_enabled"
                            checked={formik.values.lockout_enabled}
                            onCheckedChange={() => handleSwitchChange("lockout_enabled")}
                        />
                    </div>
                </div>
            </div>

            {/* Communication Preferences */}
            <div className="space-y-4">
                <h4 className="text-md font-medium">Communication Preferences</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="email_subscribed"
                            checked={formik.values.email_subscribed}
                            onCheckedChange={() => handleSwitchChange("email_subscribed")}
                        />
                        <Label htmlFor="email_subscribed">Email Notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sms_subscribed"
                            checked={formik.values.sms_subscribed}
                            onCheckedChange={() => handleSwitchChange("sms_subscribed")}
                        />
                        <Label htmlFor="sms_subscribed">SMS Notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="whatsapp_subscribed"
                            checked={formik.values.whatsapp_subscribed}
                            onCheckedChange={() => handleSwitchChange("whatsapp_subscribed")}
                        />
                        <Label htmlFor="whatsapp_subscribed">WhatsApp Notifications</Label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoForm;
