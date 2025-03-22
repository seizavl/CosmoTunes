import React, { useEffect, useState } from 'react';
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
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);

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

        setLoading(false);
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
                position: "absolute",
                top: "10%",
                left: "40%",
                transform: "translateX(-50%)",
                zIndex: 9999,
            }}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                    position: 'relative',
                    width: '384px',
                    padding: '8px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
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
                    <Search color="white" />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GlassmorphismSearchBar;
