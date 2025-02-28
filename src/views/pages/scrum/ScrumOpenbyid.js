import { Button, Chip } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import MainCard from 'ui-component/cards/MainCard';
import './index.css';
import { API } from 'Constants/API';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router';

const ScrumOpenbyid = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const token = localStorage.getItem('Token');
    const user_id = localStorage.getItem('userId');
    const params = useParams();
    const id = params.id;
    const getScrumDetails = async () => {
        const URL = API.GET_SCRUM_DATA;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_scrum_data',
                { user_id, id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                console.log(result.data, 'result');
                setData(result.data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getScrumDetails();
    }, []);

    // const datas = document.getElementById('hello');
    // if (datas) {
    //     if(data.scrum_cc === null){

    //     }
    // }
    return (
        <MainCard title="Scrum Details">
            <div className="scrums">
                {/* <button
                    onClick={() => {
                        navigate('/scrum-report');
                    }}
                    className="back_to_scrum"
                >
                    <BiArrowBack className="left_arrow_icon" /> Back to scrum
                </button> */}

                <Button
                    size="large"
                    variant="contained"
                    className="from_date"
                    color="secondary"
                    style={{ padding: '10px 20px' }}
                    onClick={() => {
                        navigate('/scrum-report');
                        dispatch({ type: MENU_OPEN, id: 'scrum' });
                    }}
                    startIcon={<BiArrowBack />}
                >
                    Back to scrum
                </Button>
                <div className="fromdetails">
                    {/* <p>
                        <b>From:</b>create_date
                    </p> */}
                    {/* <p>
                        <b>To:</b> {data.scrum_to}
                    </p>
                    <p id="hello" style={{ display: data.scrum_cc?.length === 0 ? 'none' : 'block' }}>
                        <b>CC:</b> {data.scrum_cc}
                    </p> */}
                    <p>
                        <b>Subject:</b> {data.scrum_subject}
                    </p>
                </div>
                <div className="preview">
                    <b style={{ color: '#673AB7' }}>Description:</b>
                    <div dangerouslySetInnerHTML={{ __html: data.scrum_description }}></div>
                </div>
            </div>
        </MainCard>
    );
};

export default ScrumOpenbyid;
