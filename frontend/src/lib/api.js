import { axiosInstance } from '../lib/axios.js';

export const signup = async (signUpData) => {
    const res = await axiosInstance.post('/api/auth/signup', signUpData);
    return res.data;
};

export const getAuthUser =  async () => {
    const res = await axiosInstance.get('/api/auth/me'); 
    return res.data;
}


export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post('/api/auth/complete-onboarding', onboardingData);
    return res.data;
}