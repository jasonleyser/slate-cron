const users = [
    { account: 'archillect', freq: 'hourly', run_time: ':25' },
]


export default function Index() {
    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div>
          <table style={{ width: '800px', borderCollapse: 'collapse', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr>
                <th>Account</th>
                <th>Frquency</th>
                <th>Run time</th>
              </tr>
            </thead>
            {users.map((user) => (
              <tr>
                <th><a target="_blank" href={`https://twitter.com/${user.account}`}>@{user.account}</a></th>
                <th>{user.freq}</th>
                <th>{user.run_time}</th>
              </tr>
            ))}
          </table>
        </div>
      </div>
    )
}