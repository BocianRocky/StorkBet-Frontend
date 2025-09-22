import React from 'react';
import { Button } from "@/components/ui/button"

import { Promotion } from "../../types/promotion"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

interface PromotionCardProps {
    promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {


    return(
        
        <Card className="w-[350px]">
            <CardHeader className='h-[220px] p-3'>
                <img src={promotion.image} alt={promotion.title} className="w-full h-full object-cover rounded-[0.75rem]" />
                
            </CardHeader>
            <CardContent className='p-3'>
                <CardTitle>{promotion.title}</CardTitle>
                <CardDescription>{promotion.description}</CardDescription>
            </CardContent>
            <CardFooter className='flex justify-center p-3'>
                <Button>Zobacz więcej</Button>
            </CardFooter>

        </Card>
    )
}
export default PromotionCard;