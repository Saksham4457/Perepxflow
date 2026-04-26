/**
 * Prepxflow Data Store
 * Simulates a backend with LocalStorage
 */

const Store = {
    getUser: () => {
        const data = localStorage.getItem('prepxflow_user');
        return data ? JSON.parse(data) : null;
    },
    
    saveUser: (user) => {
        localStorage.setItem('prepxflow_user', JSON.stringify(user));
    },
    
    getBuddies: () => {
        // Simulated buddies
        return [
            { id: 1, name: 'Aryan S.', exam: 'JEE', consistency: 92, status: 'Online' },
            { id: 2, name: 'Priyanka M.', exam: 'UPSC', consistency: 88, status: 'In Flow' },
            { id: 3, name: 'Rahul K.', exam: 'CUET', consistency: 85, status: 'Offline' }
        ];
    },
    
    getChallenges: () => {
        return [
            { id: 1, title: '7-Day Consistency', participants: 1240, progress: 65, type: 'Streak' },
            { id: 2, title: '50-Hour Weekly', participants: 850, progress: 40, type: 'Volume' },
            { id: 3, title: 'No-Distraction Sprint', participants: 2100, progress: 90, type: 'Focus' }
        ];
    },
    
    getStats: () => {
        const user = Store.getUser();
        return user ? user.stats : {
            hours: [4, 6, 5, 8, 2, 0, 0],
            consistency: 75,
            streak: 5,
            partner_hours: [3, 7, 4, 9, 3, 0, 0]
        };
    },

    getCommunityPosts: () => {
        return [
            { id: 1, user: 'Aryan S.', content: 'Completed 50-hour weekly challenge. Discipline is everything.', time: '2h ago', tags: ['Achievement'] },
            { id: 2, user: 'Priyanka M.', content: 'Matched with a new study partner for UPSC prep. Consistency up by 12%.', time: '5h ago', tags: ['Momentum'] }
        ];
    },

    getAIPartners: () => {
        return [
            { 
                id: 'enforcer', 
                name: 'Discipline Enforcer', 
                role: 'Strict Accountability', 
                desc: 'Focuses on completion. No excuses allowed.',
                avatar: 'shield-alert',
                color: '#ff4b2b'
            },
            { 
                id: 'coach', 
                name: 'Flow Coach', 
                role: 'Performance Optimization', 
                desc: 'Guides deep work sessions and prevents burnout.',
                avatar: 'zap',
                color: '#00f2ff'
            },
            { 
                id: 'strategist', 
                name: 'Exam Strategist', 
                role: 'Strategic Planning', 
                desc: 'Optimizes study focus based on high-yield topics.',
                avatar: 'target',
                color: '#7000ff'
            },
            { 
                id: 'tracker', 
                name: 'Consistency Tracker', 
                role: 'Momentum Builder', 
                desc: 'Monitors streaks and ensures you never miss a day.',
                avatar: 'calendar',
                color: '#00ff88'
            }
        ];
    },

    getProblems: () => {
        return [
            { id: 1, title: 'How to optimize revision for JEE organic chemistry?', user: 'Rahul K.', answers: 5, status: 'Solved' },
            { id: 2, title: 'Best focus techniques for 4+ hour deep work blocks?', user: 'Ananya P.', answers: 8, status: 'Open' }
        ];
    }
};
