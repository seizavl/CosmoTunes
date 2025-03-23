import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchResult {
    title: string;
    artist: string;
    videoId: string;
    thumbnail: string;
    url: string;
}

interface GlassmorphismSearchBarProps {
    onSearch: (results: SearchResult[]) => void;
}

const GlassmorphismSearchBar: React.FC<GlassmorphismSearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (res.ok) {
                const data = await res.json();
                onSearch(data.results);
            } else {
                console.error('検索エラー');
            }
        } catch (error) {
            console.error('通信エラー:', error);
        }

    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                zIndex: 9999,
            }}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                    width: "600px",
                    background: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(5px)', 
                    WebkitBackdropFilter: 'blur(5px)',
                    borderRadius: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
                }}
            >
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search..."
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '16px',
                    transform: 'translateY(-50%)',
                }}>
                    <Search color="white" style={{
                        marginTop: '5px',
                        marginRight: '-6px',
                    }} />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GlassmorphismSearchBar;
