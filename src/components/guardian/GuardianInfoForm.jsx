import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import useSWR from "swr";
import * as Yup from "yup";

const GuardianInfoForm = ({ onDataUpdate, initialData }) => {
    const { data: user = {} } = useSWR("/me", url => axios.get(url).then(res => res?.data?.data || {}));

    // Define validation schema with Yup
    const validationSchema = Yup.object({
        guardian_name: Yup.string().trim().required('Guardian name is required'),
        guardian_email: Yup.string()
            .email('Please enter a valid email address')
            .required('Guardian email is required'),
        guardian_phone: Yup.string()
            .test(
                'is-valid-phone',
                'Please enter a valid phone number',
                value => !value || /^\d{10,15}$/.test(value.replace(/[^0-9]/g, ''))
            ),
        guardian_job_title: Yup.string()
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            active: true,
            access_level: "Primary",
            access_date: new Date().toISOString(),
            student: parseInt(user?.student_id) || "",
            student_name: user?.first_name + " " + user?.last_name || "",
            guardian_name: "",
            guardian_email: "",
            guardian_phone: "",
            guardian_job_title: "",
            ...(initialData || {})
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true
    });

    // Update parent component when form data changes
    useEffect(() => {
        if (formik.isValid && Object.keys(formik.touched).length > 0) {
            onDataUpdate(formik.values);
        } else if (!formik.isValid && Object.keys(formik.touched).length > 0) {
            onDataUpdate(null);
        }
    }, [formik.values, formik.isValid, formik.touched]);

    // Update form values if user data changes
    useEffect(() => {
        if (user?.student_id) {
            formik.setValues({
                ...formik.values,
                student: parseInt(user.student_id),
                student_name: user.first_name + " " + user.last_name
            });
        }
    }, [user]);

    return (
        <Card className="p-6 space-y-6">
            <div className="space-y-1.5">
                <h3 className="text-xl font-semibold">Guardian Information</h3>
            </div>

            <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="guardian_name">
                        Guardian Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="guardian_name"
                        name="guardian_name"
                        value={formik.values.guardian_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.guardian_name && formik.errors.guardian_name && (
                        <p className="text-sm text-red-500">{formik.errors.guardian_name}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="guardian_email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                        id="guardian_email"
                        name="guardian_email"
                        type="email"
                        value={formik.values.guardian_email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.guardian_email && formik.errors.guardian_email && (
                        <p className="text-sm text-red-500">{formik.errors.guardian_email}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="guardian_phone">Phone Number</Label>
                    <Input
                        id="guardian_phone"
                        name="guardian_phone"
                        value={formik.values.guardian_phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.guardian_phone && formik.errors.guardian_phone && (
                        <p className="text-sm text-red-500">{formik.errors.guardian_phone}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="guardian_job_title">Job Title</Label>
                    <Input
                        id="guardian_job_title"
                        name="guardian_job_title"
                        value={formik.values.guardian_job_title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </form>
        </Card>
    );
};

export default GuardianInfoForm;