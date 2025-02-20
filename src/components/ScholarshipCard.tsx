import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, GraduationCap, Banknote } from 'lucide-react';

type ScholarshipDetails = {
  program_info: {
    name: string;
    provider: string;
    type: string;
  };
  benefits: {
    financial: string;
    academic: string;
    other: string;
  };
  requirements: {
    eligibility?: string[];
    application?: string[];
    selection_criteria?: string[];
    fields?: string[];
    eligibility_criteria?: string;
  };
  deadlines: {
    application_deadline?: string;
  } | string;
};

type ScholarshipCardProps = {
  details: ScholarshipDetails;
  tags: string[];
};

const ScholarshipCard = ({ details, tags }: ScholarshipCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-xl font-bold">{details.program_info.name}</CardTitle>
          <CardDescription>{details.program_info.provider}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-green-600" />
              <span>{details.benefits.financial}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>{details.program_info.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Deadline: {typeof details.deadlines === 'string' ?
                details.deadlines :
                details.deadlines.application_deadline}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">View Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{details.program_info.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                  <ul className="space-y-2">
                    <li><strong>Financial:</strong> {details.benefits.financial}</li>
                    <li><strong>Academic:</strong> {details.benefits.academic}</li>
                    <li><strong>Other:</strong> {details.benefits.other}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  {details.requirements.eligibility && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Eligibility:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {details.requirements.eligibility.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {details.requirements.application && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Application Process:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {details.requirements.application.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {details.requirements.selection_criteria && (
                    <div>
                      <h4 className="font-medium mb-1">Selection Criteria:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {details.requirements.selection_criteria.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Provider Information</h3>
                  <p><strong>Institution:</strong> {details.program_info.provider}</p>
                  <p><strong>Program Type:</strong> {details.program_info.type}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
};
