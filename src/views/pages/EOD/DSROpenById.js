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

const DSROpenbyid = () => {
    const navigate = useNavigate();
    const [data, setData] = useState();
    const token = localStorage.getItem('Token');
    const user_id = localStorage.getItem('userId');
    const params = useParams();
    const id = params.id;
    const getDSRDetails = async () => {
        const URL = API.GET_DSR;
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
                console.log(result.data.data, 'hello I am in');
                setData(result.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getDSRDetails();
    }, []);

    // const datas = document.getElementById('hello');
    // if (datas) {
    //     if(data.scrum_cc === null){

    //     }
    // }
    return (
        <MainCard title="DSR Details">
            <div className="dsr">
                <Button
                    size="large"
                    variant="contained"
                    className="from_date"
                    color="secondary"
                    style={{ padding: '10px 20px' }}
                    onClick={() => {
                        navigate('/dsr');
                        dispatch({ type: MENU_OPEN, id: 'dsr' });
                    }}
                    startIcon={<BiArrowBack />}
                >
                    Back to DSR
                </Button>
                <div className="fromdetails">
                    <p>
                        <b>Subject:</b> {data?.title}
                    </p>
                </div>
                <div className="preview">
                    <b style={{ color: '#673AB7' }}>Description:</b>
                    <div dangerouslySetInnerHTML={{ __html: data?.report_description }}></div>
                </div>
            </div>
        </MainCard>
    );
};

export default DSROpenbyid;
