"use client"

import Events from "@/components/dashboard/Events";
import Teams from "@/components/dashboard/Teams";
import MatchPlan from "@/components/dashboard/MatchPlan";

const Dashboard = () => {


    return (
        <div>
            <details className='container mx-auto p-4'>
                <summary className='text-3xl font-bold mb-4'>クラス</summary>
                <Teams/>
            </details>

            <details className='container mx-auto p-4'>
                <summary className='text-3xl font-bold mb-4'>種目</summary>
                <Events/>
            </details>

            <details className='container mx-auto p-4'>
                <summary className='text-3xl font-bold mb-4'>試合</summary>
                <MatchPlan />
            </details>
        </div>
    )
}

export default Dashboard;