import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Download, FileText, Link, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function CourseResource({ courseData }) {
    const [copiedLinks, setCopiedLinks] = useState({});

    // Extract course resources
    const resources = {
        documents: courseData?.course_resources || [],
        notes: courseData?.course_notes || [],
        links: courseData?.course_links || [],
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Course Resources</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="resources" className="w-full">
                    <TabsList className="w-full justify-start">
                        {/* <TabsTrigger value="resources">Resources</TabsTrigger> */}
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="links">Useful Links</TabsTrigger>
                    </TabsList>

                    {/* ----------------- resources ---------------  */}
                    <TabsContent value="resources" className="mt-4">
                        <ScrollArea className="h-[300px]">
                            {courseData ? (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-medium">{courseData?.course?.name || 'Course Name'}</p>
                                                <p className="text-sm text-muted-foreground">{courseData?.course?.short_description?.replace(/<[^>]*>/g, '') || 'No description available'}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">No resources available</div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    {/* ----------------- notes ---------------  */}
                    <TabsContent value="notes" className="mt-4">
                        <ScrollArea className="h-[300px]">
                            {
                                courseData ? (
                                    <div className="flex flex-col gap-2">


                                        <div className="p-4 border rounded-lg">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-medium">{courseData?.course?.internal_notes || 'No notes available'}</span>
                                            </div>
                                            {/* <p className="text-sm">{courseData.course.content}</p> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">No notes available</div>
                                )
                            }
                        </ScrollArea>
                    </TabsContent>

                    {/* ----------------- links ---------------  */}
                    <TabsContent value="links" className="mt-4">
                        <ScrollArea className="h-[300px]">
                            {resources.links.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {resources.links.map((link, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <Link className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-medium">{link.title}</p>
                                                    <p className="text-sm text-muted-foreground truncate max-w-md">{link.url}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={async () => {
                                                    await navigator.clipboard.writeText(link.url);
                                                    setCopiedLinks({ ...copiedLinks, [index]: true });
                                                    setTimeout(() => {
                                                        setCopiedLinks((prev) => ({ ...prev, [index]: false }));
                                                    }, 1000);
                                                }}
                                            >
                                                {copiedLinks[index] ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <Link className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">No links available</div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>
    )
}
