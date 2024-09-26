import dayjs from "dayjs";

// function: yymmdd 형태의 생년월일을 만 나이로 구하는 함수 //
export const calculateAge = (birthString: string) => {
    const yearString = birthString.substring(0, 2);
    const monthString = birthString.substring(2, 4);
    const dayString = birthString.substring(4, 6);

    const birth = dayjs(`19${yearString}-${monthString}-${dayString}`);
    const today = dayjs(); 

    let age = today.year() - birth.year();
    if(today.isBefore(birth.add(age, 'year'))) age-- ;
    return age;
}; 