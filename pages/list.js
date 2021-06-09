const users = [
    { account: 'archillect', collection: 'photos', freq: 'hourly', run_time: 'xx:25' },
    { account: 'wayback', collection: 'exe', freq: '2/day', run_time: '12:30, 6:30' },
];

export default function Index() {
    return (
      <div style={{ position: 'absolute', backgroundColor: "#fdfdfd", top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div>
          <table style={{ width: '800px', border: '1px solid #fdfdfd', borderCollapse: 'collapse', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #cacaca' }}>
                <th>Account</th>
                <th>Frquency</th>
                <th>Runs at (MT)</th>
              </tr>
            </thead>
            {users.map((user) => (
              <tr style={{ paddingBottom: '1em' }}>
                <th>
                  <a target="_blank" href={`https://slate.host/${user.account}/${user.collection}`}>
                    @{user.account}/{user.collection}
                  </a>
                </th>
                <th>{user.freq}</th>
                <th>{user.run_time}</th>
              </tr>
            ))}
          </table>
        </div>
      </div>
    )
}