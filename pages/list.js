import Head from 'next/head'

const users = [
    { account: 'archillect', collection: 'photos', freq: 'hourly', run_time: 'xx:26' },
    { account: 'moma', collection: 'objects', freq: '4 hours', run_time: '10:05, 2:05, 6:05' },
    { account: 'wayback', collection: 'exe', freq: '6 hours', run_time: '2:22, 8:22' },
    { account: '90s_nba', collection: 'photos', freq: '6 hours', run_time: '10:00, 6:00' },
    { account: 'photoinreallife', collection: 'locations', freq: '6 hours', run_time: '10:05, 2:05, 6:05' },
    { account: 'artistkandinsky', collection: 'art', freq: '12 hours', run_time: '10:05, 2:05, 6:05' },
];

export default function List() {
    return (
      <>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
        </Head>

        <div style={{ position: 'absolute', backgroundColor: "#fdfdfd", top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Inter' }}>
          <div>
            <table style={{ borderSpacing: '0 50px', width: '500px', border: '1px solid #fdfdfd', borderCollapse: 'collapse', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cacaca' }}>
                  <th>Account</th>
                  <th>Frquency</th>
                </tr>
              </thead>
              {users.map((user) => (
                <tr style={{ borderSpacing: '20px' }}>
                  <th>
                    <a style={{ textDecoration: 'none', color: '#0566BB', marginTop: '8px' }} target="_blank" href={`https://slate.host/${user.account}/${user.collection}`}>
                      @{user.account}/{user.collection}
                    </a>
                  </th>
                  <th>{user.freq}</th>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </>
    )
}