import React, { useEffect, useState } from 'react'
import '../../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom'
import register from '../../images/register.png'
import axios from 'axios'
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate()
    const [uname, setName] = useState('') // User name field
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('') // Phone number field
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [emergencyNo, setEmrNumber] = useState('')
    const [emergencyMail, setEmrEmail] = useState('')
    const [pincode, setPincode] = useState('')

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!uname.trim()) {
            toast.error('Full Name is required');
            return false;
        }
        if (!email.trim()) {
            toast.error('Email is required');
            return false;
        }
        if (!validateEmail(email)) {
            toast.error('Invalid Email Format');
            return false;
        }
        if (!phone.trim()) {
            toast.error('Phone Number is required');
            return false;
        }
        if (!password.trim()) {
            toast.error('Password is required');
            return false;
        }
        if (!emergencyNo.trim()) {
            toast.error('Emergence Number is required');
            return false;
        }
        if (phone == emergencyNo) {
            toast.error('Emergence Phone and Personal Phone must be different');
            return false;
        }
        if (!emergencyMail.trim()) {
            toast.error('Emergence Email is required');
            return false;
        }
        if (email == emergencyMail) {
            toast.error('Emergence Email and Personal Email must be different');
            return false;
        }
        if (!pincode.trim()) {
            toast.error('PinCode is required');
            return false;
        }
        try {
            const res = await axios.post('http://localhost:8000/api/v1/users/register',
                { 
                    uname, 
                    email, 
                    phoneNo: phone, // Changed from phone to phoneNo
                    password,
                    emergencyNo: Number(emergencyNo), // Convert to number
                    emergencyMail,
                    pinCode: Number(pincode) // Convert to number
                });
            
            if (res.status === 201) {
                toast.success('Register Successfully! Please check your email for verification.');
                navigate('/login');
            } else if (res.status === 400) {
                toast.error(res.data?.message || 'Email Already Exists! Please Login');
            } else {
                toast.error('Registration Failed: ' + (res.data?.message || 'Please try again'));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error While Register');
            console.error('Registration error:', err.response?.data || err.message);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className='my-5'>
            <div class="container d-flex justify-content-center align-items-center ">
                <div class="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                    <div class="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                        <div class="featured-image mb-3 animateImg">
                            <img src={register} class="img-fluid" width={500} className='mt-5' />
                        </div>
                    </div>
                    <div class="col-md-6 right-box">
                        <div class="row align-items-center">
                            <div class="header-text mb-2">
                                <h2>Welcome</h2>
                                <p>We are happy to have you Here</p>
                            </div>
                            <div class="input-group d-flex flex-row align-items-center mb-3">
                                <div class="form-outline flex-fill mb-0">
                                    <input value={uname} type="text" onChange={(e) => setName(e.target.value)} class="form-control form-control-lg border-dark fs-6" placeholder="Full Name" required />
                                </div>
                            </div>
                            <div class="input-group d-flex  align-items-center mb-3">
                                <div class="form-outline flex-fill mb-0">
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" class="form-control form-control-lg border-dark  fs-6" placeholder="Email Address" required />
                                </div>
                            </div>
                            <div class="input-group d-flex  align-items-center mb-3">
                                <div class="form-outline flex-fill mb-0">
                                    <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} class="form-control form-control-lg border-dark  fs-6" placeholder="Phone Number" required />
                                </div>
                            </div>
                            <div class="input-group d-flex flex-row align-items-center mb-3">
                                <div class="form-outline flex-fill mb-0">
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} class="form-control form-control-lg border-dark fs-6" placeholder="Password" required />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                                        <i class={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                                </div>
                            </div>
                            <div class="input-group d-flex flex-row align-items-center mb-3">
                                <div class="form-outline flex-fill mb-0">
                                    <input value={emergencyNo} type="number" onChange={(e) => setEmrNumber(e.target.value)} class="form-control form-control-lg border-dark fs-6" placeholder="Emergence Number" required />
                                </div>
                            </div>
                            <div class="input-group d-flex flex-row align-items-center mb-3">
                                <div class="form-outline flex-fill mb-0">
                                    <input value={emergencyMail} type="email" onChange={(e) => setEmrEmail(e.target.value)} class="form-control form-control-lg border-dark fs-6" placeholder="Emergence Email" required />
                                </div>
                            </div>
                            <div class="input-group d-flex flex-row align-items-center mb-3">
                                <div class="form-outline flex-fill mb-0">
                                    <input value={pincode} type="number" onChange={(e) => setPincode(e.target.value)} class="form-control form-control-lg border-dark fs-6" placeholder="Pincode" required />
                                </div>
                            </div>
                            <div class="d-flex flex-row align-items-center mt-4 ">
                                <div class="form-outline flex-fill mb-0">
                                    <button class="btn btn-lg  text-white" onClick={handleSubmit} type="button" style={{ backgroundColor: 'blueviolet', width: '100%' }} >Register</button>
                                </div>
                            </div>
                            <div class="d-flex flex-row align-items-center my-3 ">
                                <div class="form-outline flex-fill mb-0 " >
                                    <Link to='/login' class="btn btn-outline-dark btn-lg btn-block" style={{ width: '100%' }} type="button">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Register
