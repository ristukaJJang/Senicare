import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router'
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, HR_ABSOLUTE_PATH } from 'src/constants';
import { getChargedCustomerRequest, getNurseRequest, patchNurseRequest } from 'src/apis';
import { GetChargedCustomerResponseDto, GetNurseResponseDto } from 'src/apis/dto/response/nurse';
import { ResponseDto } from 'src/apis/dto/response';
import { usePagination } from 'src/hooks';
import Pagination from 'src/components/Pagination';
import { ChargedCustomer } from 'src/types';
import { calculateAge } from 'src/utils';
import { useHrDetailUpdateStore, useSignInUserStore } from 'src/stores';
import { PatchNurseRequestDto } from 'src/apis/dto/request/nurse';

// component: 인사 정보 상세 보기 컴포넌트 //
export default function  HrDetail() {

    // state: 요양사 아이디 상태 //
    const {userId} = useParams();

    // state: login user //
    const {signInUser} = useSignInUserStore();

    // state: 수정 화면 상태 //
    const {update, setUpdate} = useHrDetailUpdateStore();
    
    // state: cookie //
    const [cookies] = useCookies();

    // state: 요양사 정보 상태 //
    const [name, setName] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');

    // state: 요양사 변경한 이름 상태 //
    const [updateName, setUpdateName] = useState<string>('');

    // state: paging //
    const {
        currentPage, totalPage, totalCount, viewList,
        initViewList, setTotalList, ...PaginationProps
    } = usePagination<ChargedCustomer>();

    // state: navigator //
    const navigator = useNavigate();

    // variable: 본인 여부 확인 //
    const isSignInUser = userId === signInUser?.userId;

    // function: get nurse response 처리 함수 //
    const getNurseResponse = (responseBody: GetNurseResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 요양사입니다.' : 
            responseBody.code === 'DBE'? '서버에 문제가 있습니다.' : '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            navigator(HR_ABSOLUTE_PATH)
            return;
        }
        const {name, telNumber} = responseBody as GetNurseResponseDto;
        setName(name);
        setTelNumber(telNumber);
    };

    // function: get charged customer response 함수 //
    const getChargedCustomerResponse = (responseBody: GetChargedCustomerResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            return;
        }
        const {customers} = responseBody as GetChargedCustomerResponseDto;
        setTotalList(customers);
    };

    // function: patch nurse response 함수 //
    const patchNurseResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '모든 값을 입력해주세요.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'NI' ? '존재하지 않는 요양사입니다.' : '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            return;
        }
        setUpdate(false);

        const accessToken = cookies[ACCESS_TOKEN];
        if(!userId || !accessToken) return;
        getNurseRequest(userId, accessToken).then(getNurseResponse);
    };

    // event handler: 이름 변경 이벤트 핸들러 //
    const onUpdateNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setUpdateName(value);
    };

    // event handler: 수정 화면 버튼 클릭 이벤트 핸들러 //
    const onShowUpdateClickHandler = () => {
        setUpdate(true);
    }; 

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onUpdateCancleClickHandler = () => {
        setUpdate(false);
    };

    // event handler: 저장 버튼 클릭 이벤트 핸들러 //
    const onUpdateButtonClickHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if(!isSignInUser || !updateName || !accessToken) return;

        const requestBody: PatchNurseRequestDto = {
            name: updateName
        };
        patchNurseRequest(requestBody, accessToken).then(patchNurseResponse);
    };

    // event handler: 목록 버튼 클릭 이벤트 핸들러 //
    const onListButtonClickHandler = () => {
        navigator(HR_ABSOLUTE_PATH);
    };

    // effect: 요양사 아이디가 변경될 시 실행할 요양사 정보 불러오기 //
    useEffect(() => {
        if(!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        getNurseRequest(userId, accessToken).then(getNurseResponse);
        getChargedCustomerRequest(userId, accessToken).then(getChargedCustomerResponse);
    }, [userId]);

    // effect: 업데이트 상태가 변경될 시 실행할 함수 //
    useEffect(() => {
        setUpdateName(name);
    }, [update, name]);

    // render: 인사 정보 상세 보기 렌더링 //
    return (
        <div id='hr-detail-wrapper'>
            <div className='top'>
                <div className='info-box'>
                    <div className='label'>아이디</div>
                    <div className='text'>{userId}</div>
                </div>
                <div className='info-box'>
                    <div className='label'>이름</div>
                    {update ? 
                            <input className='input' value={updateName} placeholder='이름을 입력해주세요.' onChange={onUpdateNameChangeHandler}/>
                        :
                            <div className='text'>{name}</div>
                    }
                    
                </div>
                <div className='info-box'>
                    <div className='label'>전화번호</div>
                    <div className='text'>{telNumber}</div>
                </div>
            </div>

            <div className='middle'>
                <div className='title'>관리 중인 고객 리스트</div>

                <div className='table'>
                    <div className='th'>
                        <div className='td-customer-number'>고객번호</div>
                        <div className='td-customer-name'>고객명</div>
                        <div className='td-customer-age'>나이</div>
                        <div className='td-customer-location'>지역</div>
                    </div>

                    {viewList.map((customer, index) => 
                        <div key={index} className='tr'>
                            <div className='td-customer-number'>{customer.customerNumber}</div>
                            <div className='td-customer-name'>{customer.name}</div>
                            <div className='td-customer-age'>{calculateAge(customer.birth)}</div>
                            <div className='td-customer-location'>{customer.location}</div>
                        </div>
                    )}
                    
                </div>

                <div className='middle-bottom'>
                    <Pagination currentPage={currentPage} {...PaginationProps} />
                </div>
            </div>

            <div className='bottom'>
                <div className='button primary' onClick={onListButtonClickHandler}>목록</div>
                {isSignInUser && (update ? 
                        <div className='button-box'>
                            <div className='button disable' onClick={onUpdateCancleClickHandler}>취소</div>
                            <div className='button second' onClick={onUpdateButtonClickHandler}>저장</div>
                        </div>
                    :
                        <div className='button second' onClick={onShowUpdateClickHandler}>수정</div>
                )}
                
            </div>
        </div>   
    )
}
