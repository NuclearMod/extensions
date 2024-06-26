import React, { useState, useEffect, useRef } from "react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import scratchblocks from 'scratchblocks';
import icon from '../icon.png';
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from '../ThemeContext';

const Doc = () => {
    const { docId, folderDoc } = useParams();
    const [markdownContent, setMarkdownContent] = useState('');
    const [scratchStyle, setScratchStyle] = useState('scratch3'); // State to manage scratch block style
    const markdownRef = useRef(null);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const checkDocIdAndFetchMarkdown = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/docs.json`); // For security reasons
                const docs = await response.json();

                if (!docs.includes(docId) && folderDoc === undefined) {
                    navigate('/');
                    return;
                }

                console.log('Does it have folder? (example: "website.com/extensions/#/User/doc": ' + (folderDoc !== undefined));

                let markdownResponse;

                if (folderDoc !== undefined) {
                    markdownResponse = await fetch(`${process.env.PUBLIC_URL}/docs/${folderDoc}/${docId}.md`);
                } else {
                    markdownResponse = await fetch(`${process.env.PUBLIC_URL}/docs/${docId}.md`);
                }

                if (!markdownResponse.ok) {
                    throw new Error('Failed to fetch markdown');
                }
                const markdownText = await markdownResponse.text();
                setMarkdownContent(markdownText);
            } catch (error) {
                console.error('Error:', error);
                navigate('/'); // Fallback in case of error
            }
        };

        checkDocIdAndFetchMarkdown();
    }, [docId, folderDoc, navigate]);

    useEffect(() => {
        if (markdownContent && markdownRef.current) {
            setTimeout(() => {
                scratchblocks.renderMatching("code.language-scratch", {
                    languages: ['en'],
                    style: scratchStyle, // Use selected scratch style
                    scale: scratchStyle === "scratch2" ? 1 : 0.8,
                });
            }, 500); // Adjust delay if necessary
        }
    }, [markdownContent, scratchStyle]);

    useEffect(() => {
        // Retrieve saved scratch style from localStorage
        const savedScratchStyle = localStorage.getItem('scratchStyle');
        if (savedScratchStyle) {
            setScratchStyle(savedScratchStyle);
        }
    }, []);

    const handleStyleChange = (event) => {
        const style = event.target.value;
        setScratchStyle(style);
        localStorage.setItem('scratchStyle', style); // Save selected style to localStorage
        window.location.reload(); // Reload the page after style change
    };

    return (
        <div>
            <div style={{ backgroundColor: theme === 'dark' ? '#333' : '#FFA900', color: theme === 'dark' ? '#FFF' : 'white', padding: '10px' }}>
                <center>
                    <a style={{ fontSize: '1.1em', color: 'white', textDecoration: 'none' }} href="/extensions">
                        <strong>
                            <img src={icon} alt="logo" style={{ width: "2em", marginRight: "5px" }} />
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
                <br />
                <center>
                <div className="form-group">
                    <select id="scratchStyleSelect" value={scratchStyle} onChange={handleStyleChange}>
                        <option value="scratch3">Scratch 3 Blocks</option>
                        <option value="scratch2">Scratch 2 Blocks</option>
                        <option value="scratch3-high-contrast">Scratch 3 High Contrast</option>
                    </select>
                </div>
                </center>
                <br /><br />
            </div>
        </div>
    );
};

export default Doc;
