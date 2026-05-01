import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, Clock, Star } from "lucide-react";

import authorAvatar from "@/assets/custom-image/Eftyoffice.jpg";
import Image from "next/image";
import Link from "next/link";

const RatingStars = ({ rating }) => {
	return (
		<div className="flex items-center justify-left mt-2">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={`w-5 h-5 mr-1 ${star <= Math.round(rating)
						? "text-yellow-400 fill-current"
						: "text-gray-300"
						}`}
				/>
			))}
		</div>
	);
};