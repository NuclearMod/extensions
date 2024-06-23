import React, { useState, useEffect, useRef } from "react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import scratchblocks from 'scratchblocks';
import icon from '../icon.png';
import { useParams, useNavigate } from "react-router-dom";

const Doc = () => {
    const { docId } = useParams();
    const [markdownContent, setMarkdownContent] = useState('');
    const markdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkDocIdAndFetchMarkdown = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/docs.json`); // For security reasons
                const docs = await response.json();

                if (!docs.includes(docId)) {
                    navigate('/extensions');
                    return;
                }

                const markdownResponse = await fetch(`${process.env.PUBLIC_URL}/docs/${docId}.md`);
                if (!markdownResponse.ok) {
                    throw new Error('Failed to fetch markdown');
                }
                const markdownText = await markdownResponse.text();
                setMarkdownContent(markdownText);
            } catch (error) {
                console.error('Error:', error);
                navigate('/extensions'); // Fallback in case of error
            }
        };

        checkDocIdAndFetchMarkdown();
    }, [docId, navigate]);

    useEffect(() => {
        if (markdownRef.current) {
            scratchblocks.renderMatching("code.language-scratch", {
                inline: true,
                languages: ['en'],
                style: 'scratch3',
                scale: 0.8,
            });
        }
    }, [markdownContent]);

    return (
        <div>
            <div style={{backgroundColor: '#FFA900', color: 'white', padding: '10px'}}>
                <center>
                    <a style={{fontSize: '1.1em', color: 'white', textDecoration: 'none'}} href="/extensions">
                        <strong>
                            <img src={icon} alt="logo" style={{ width: "2em", marginRight: "5px"}}/>
                            NuclearMod Extensions Gallery
                        </strong>
                    </a>
                </center>
            </div>
            <br />
            <div className="container">
                <div ref={markdownRef}>
                    <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
                </div>
            </div>
        </div>
    );
};

export default Doc;
