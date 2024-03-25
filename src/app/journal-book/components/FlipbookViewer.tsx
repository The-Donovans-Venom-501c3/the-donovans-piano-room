"use client";

import React, { useState, useEffect } from "react";
import logo from "../../../../public/journal-book/logo.svg";
import Image from "next/image";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface FlipbookData {
  url: string;
  // Add other properties as needed
}

const fetchFlipbook = async (pdfLink: string, apiKey: string): Promise<FlipbookData> => {
  const url = `https://heyzine.com/api1/async?pdf=${encodeURIComponent(
    pdfLink,
  )}&k=${apiKey}&pn=1&sh=1&st=${'1'}&t&s&fs=${'1'}`;

  try {
    const response = await fetch(url,);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: FlipbookData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching flipbook:", error);
    throw error;
  }
};

const FlipbookViewer = () => {
  const [flipbookData, setFlipbookData] = useState<FlipbookData | null>(null);
  const pdfLink =
    "https://testformyjournal.s3.us-east-2.amazonaws.com/FullPlanner.pdf";
  const apiKey = "d17fbe1594e35101";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFlipbook(pdfLink, apiKey);
        setFlipbookData(data);
      } catch (error) {
        console.error("Error fetching flipbook data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-flipbook bg-cover">
        <div className="absolute top-0 left-0 p-4 w-20  md2:w-60 lg:w-60 xl:w-90 ">
        <Image
        src={logo}
        alt="logo"
        className="z-10"
        />
        </div>
      {flipbookData ? (
        <iframe
          src={flipbookData.url}
          className="h-full w-full border-none z-20"
          title="Flipbook"
        ></iframe>
      ) : (
       <div className="flex justify-center items-center h-full">
       <Box sx={{ display: 'flex' }}>
         <CircularProgress />
       </Box>
     </div>
      )}
    </div>

  );
};

export default FlipbookViewer;
