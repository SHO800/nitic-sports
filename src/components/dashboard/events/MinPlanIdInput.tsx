"use client"

const MinPlanIdInput = () => {
    return (
        <div>
            <input
                type='text'
                id='minPlanId'
                name='minPlanId'
                className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                placeholder='最小試合プランIDを入力してください'
            />
        </div>
    );
};

export default MinPlanIdInput;
