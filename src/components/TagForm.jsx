"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

export default function TagForm({ setFieldValue, values, errors, touched, onSave, isSubmitting }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);
    const [selectedMasterTagOption, setSelectedMasterTagOption] = useState(null);
    const [masterTagCategories, setMasterTagCategories] = useState([]);
    const [masterTags, setMasterTags] = useState([]);
    const [formData, setFormData] = useState({
        tag: "",
        tag_value: "",
        notes: "",
        display_sequence: 0,
        rating_score: "",
        master_tag_category_id: null,
        master_tag_id: null,
        default_tag: false
    });

    // Define select styles
    const selectStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '40px',
            border: '1px solid #d1d5db',
            '&:hover': {
                border: '1px solid #9ca3af'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#374151'
        })
    };

    // Fetch master tag categories on component mount
    useEffect(() => {
        const fetchTagCategories = async () => {
            try {
                const res = await axios.get('/master-tag-categories');
                setMasterTagCategories(res?.data?.data || []);
            } catch (error) {
                console.error("Error fetching master tag categories:", error);
            }
        };

        const fetchMasterTags = async () => {
            try {
                const res = await axios.get('/master-tags');
                setMasterTags(res?.data?.data || []);
            } catch (error) {
                console.error("Error fetching master tags:", error);
            }
        };

        fetchTagCategories();
        fetchMasterTags();
    }, []);

    // Handle form field changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (setFieldValue) {
            setFieldValue(field, value);
        }
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            tag: "",
            tag_value: "",
            notes: "",
            display_sequence: 0,
            rating_score: "",
            master_tag_category_id: null,
            master_tag_id: null,
            default_tag: false
        });
        setSelectedCategory(null);
        setSelectedCategoryOption(null);
        setSelectedMasterTagOption(null);
    };

    // Handle save with reset
    const handleSave = () => {
        if (onSave) {
            onSave(formData).then(() => {
                resetForm();
            }).catch(() => {
                // Error handling is done in parent component
            });
        }
    };

    // Setup for tag categories dropdown
    const loadTagCategories = async (inputValue) => {
        try {
            const response = await axios.get(
                `/master-tag-categories?search=${inputValue}`
            );
            return response.data.data.map((category) => ({
                value: category.id,
                label: category.name,
            }));
        } catch (error) {
            console.error("Error loading tag categories:", error);
            return [];
        }
    };

    // Setup for master tags dropdown
    const loadMasterTags = async (inputValue) => {
        try {
            // If a category is selected, filter tags by category
            let url = `/master-tags?search=${inputValue}`;
            if (selectedCategory) {
                url += `&category_id=${selectedCategory}`;
            }

            const response = await axios.get(url);
            return response.data.data.map((tag) => ({
                value: tag.id,
                label: tag.name,
            }));
        } catch (error) {
            console.error("Error loading master tags:", error);
            return [];
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tag Name */}
                <div>
                    <Label htmlFor="tag" className="mb-2">
                        Tag Name
                    </Label>
                    <Input
                        id="tag"
                        name="tag"
                        value={formData.tag}
                        onChange={(e) => handleInputChange('tag', e.target.value)}
                        placeholder="Enter tag name"
                        className={`w-full ${errors?.tag && touched?.tag ? "border-red-500" : ""}`}
                    />
                    {errors?.tag && touched?.tag && (
                        <div className="text-red-500 text-sm mt-1">{errors.tag}</div>
                    )}
                </div>

                {/* Tag Value */}
                <div>
                    <Label htmlFor="tag_value" className="mb-2">
                        Tag Value
                    </Label>
                    <Input
                        id="tag_value"
                        name="tag_value"
                        value={formData.tag_value}
                        onChange={(e) => handleInputChange('tag_value', e.target.value)}
                        placeholder="Enter tag value"
                        className={`w-full ${errors?.tag_value && touched?.tag_value ? "border-red-500" : ""}`}
                    />
                    {errors?.tag_value && touched?.tag_value && (
                        <div className="text-red-500 text-sm mt-1">{errors.tag_value}</div>
                    )}
                </div>

                {/* Display Sequence */}
                <div>
                    <Label htmlFor="display_sequence" className="mb-2">
                        Display Sequence
                    </Label>
                    <Input
                        id="display_sequence"
                        name="display_sequence"
                        type="number"
                        min="0"
                        value={formData.display_sequence}
                        onChange={(e) => handleInputChange('display_sequence', parseInt(e.target.value) || 0)}
                        placeholder="Enter display sequence"
                        className={`w-full ${errors?.display_sequence && touched?.display_sequence ? "border-red-500" : ""}`}
                    />
                    {errors?.display_sequence && touched?.display_sequence && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.display_sequence}
                        </div>
                    )}
                </div>

                {/* Rating Score */}
                <div>
                    <Label htmlFor="rating_score" className="mb-2">
                        Rating Score
                    </Label>
                    <Input
                        id="rating_score"
                        name="rating_score"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating_score}
                        onChange={(e) => handleInputChange('rating_score', e.target.value)}
                        placeholder="Enter rating score (0-5)"
                        className={`w-full ${errors?.rating_score && touched?.rating_score ? "border-red-500" : ""}`}
                    />
                    {errors?.rating_score && touched?.rating_score && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.rating_score}
                        </div>
                    )}
                </div>

                {/* Tag Category */}
                <div>
                    <Label htmlFor="master_tag_category_id" className="mb-2">
                        Tag Category
                    </Label>
                    <AsyncSelect
                        name="master_tag_category_id"
                        loadOptions={loadTagCategories}
                        defaultOptions={masterTagCategories?.map(category => ({
                            value: category.id,
                            label: category.name
                        })) || []}
                        placeholder="Select tag category"
                        value={selectedCategoryOption}
                        styles={selectStyles}
                        cacheOptions
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            handleInputChange("master_tag_category_id", value);
                            setSelectedCategory(value);
                            setSelectedCategoryOption(option);
                            // Clear master tag selection when category changes
                            handleInputChange("master_tag_id", null);
                            setSelectedMasterTagOption(null);
                        }}
                        className={`${errors?.master_tag_category_id && touched?.master_tag_category_id ? "border-red-500" : ""}`}
                    />
                    {errors?.master_tag_category_id && touched?.master_tag_category_id && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.master_tag_category_id}
                        </div>
                    )}
                </div>

                {/* Master Tag */}
                <div>
                    <Label htmlFor="master_tag_id" className="mb-2">
                        Master Tag
                    </Label>
                    <AsyncSelect
                        name="master_tag_id"
                        loadOptions={loadMasterTags}
                        defaultOptions={
                            selectedCategory && masterTags
                                ? masterTags
                                    .filter(tag => tag.master_tag_category_id === selectedCategory)
                                    .map(tag => ({
                                        value: tag.id,
                                        label: tag.name
                                    }))
                                : []
                        }
                        placeholder="Select master tag"
                        value={selectedMasterTagOption}
                        isDisabled={!selectedCategory}
                        styles={selectStyles}
                        onChange={(option) => {
                            const value = option ? option.value : null;
                            handleInputChange("master_tag_id", value);
                            setSelectedMasterTagOption(option);
                        }}
                        className={`${errors?.master_tag_id && touched?.master_tag_id ? "border-red-500" : ""}`}
                    />
                    {errors?.master_tag_id && touched?.master_tag_id && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.master_tag_id}
                        </div>
                    )}
                </div>

                {/* Default Tag */}
                <div className="flex items-center space-x-2 pt-8">
                    <input
                        type="checkbox"
                        id="default_tag"
                        name="default_tag"
                        checked={formData.default_tag}
                        onChange={(e) => handleInputChange('default_tag', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="default_tag" className="mb-0">
                        Set as Default Tag
                    </Label>
                </div>
            </div>

            {/* Notes Section */}
            <div>
                <Label htmlFor="notes" className="mb-2">
                    Notes
                </Label>
                <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter any additional notes..."
                    className={`w-full ${errors?.notes && touched?.notes ? "border-red-500" : ""}`}
                    rows={3}
                />
                {errors?.notes && touched?.notes && (
                    <div className="text-red-500 text-sm mt-1">{errors.notes}</div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                    {isSubmitting ? "Saving..." : "Save Tag"}
                </Button>
            </div>
        </div>
    );
}