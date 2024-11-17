import React from 'react';

function Leaderboards() {
    return (
        <div>
            <h1>Leaderboards</h1>
            <p>See where you rank among other players!</p>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Jane Doe</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>John Smith</td>
                        <td>90</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboards;
