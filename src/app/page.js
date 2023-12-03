"use server";
import { Suspense } from 'react';
import {
        Card,
        Grid,
        Tab,
        TabGroup,
        TabList,
        TabPanel,
        TabPanels,
        Text,
        Title,
        Table,
        TableHead,
        TableHeaderCell,
        TableBody,
        TableRow,
        TableCell,
        BarChart,
        
      } from "@tremor/react";



function useFetchData(url) {
        const [data, setData] = useState(null);
      
        useEffect(() => {
          fetch(url)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(`Error: ${err}`));
        }, [url]);
        
        return { data };
}

      function changeBackgroundColor(index) {
        if (index==0) {
          return '#ADD8E6'
        }
        if (index == 1) {
          return '#77dd77'
        }
        if (index == 2) {
          return '#ffb347'
        }
      }

      function abbrev(index) {
        if (index == 0) {
          return 'LLL'
        } 
      
        if (index == 1) {
          return 'MMM'
        }
      
        if (index == 2) {
          return 'WWW'
        }
      }

      function countRank(cnt) {
        if (cnt == 10) {
          cnt = 1;
        }
      
        return cnt+1;
      }
      
      function calculateWinPct(wins,losses,ties,points) {
        return (2 *  wins + ties) / (2 *  wins+losses+ties) * 100 * points;
      }

      

async function getData() {
  //await new Promise(resolve => setTimeout(resolve,3000))

  const res = await fetch("https://fnfantasyfootball.uc.r.appspot.com/data");

  return res.json();
}   


function valueFormatter(number) {
  return `$ ${new Intl.NumberFormat("us").format(number).toString()}`;
}

export default async function Home() {

  const data = await getData();
  console.log(data);


  function changeColor(topPts,bottomPts) {
    if (topPts > bottomPts) {
      return 'green';
    }
  
    else if (topPts < bottomPts) {
      return 'red';
    }
    
    else{
      return 'black'
    }
  }

  return (

    <main className="p-12">
      <Title><strong>FN Central Region Fantasy League</strong></Title>
      <Text>Demo Dashboard using Fantasy Football Data</Text>
      
      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Props</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Suspense fallback={<Loading />}>
              {data && (data.league_list.map((league_list,index) => (
              
              <Card key={league_list.name} style={{backgroundColor:changeBackgroundColor(index)}}>
                <Title>{league_list.name}</Title>
                
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Rank</TableHeaderCell>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>PF</TableHeaderCell>
                      <TableHeaderCell>W/L/T</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {league_list.player_list.sort((a,b) => calculateWinPct(b.wins,b.losses,b.ties,b.points) - calculateWinPct(a.wins,a.losses,a.ties,a.points) ).map((player_list,index) => (
                    <TableRow key={player_list.name}>
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {player_list.name}
                      </TableCell>
                      <TableCell>
                        {player_list.points.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {player_list.wins}-{player_list.losses}-{player_list.ties}
                      </TableCell>
                      
                    </TableRow>

                  ))}
                  </TableBody>

                </Table>
              </Card>)))}
              </Suspense>
              
            </Grid>
            <Grid numItemsLg={1} className="gap-6 mt-6">
          
              {data && (data.league_list.map((league_list,index) => (
                <Card key={league_list.name} style={{backgroundColor:changeBackgroundColor(index)}}>
                <Title>{league_list.name}</Title>
                <BarChart className="mt-6"
                    data={league_list.player_list}
                    index="name"
                    categories={["points"]}
                    colors={["blue"]}
                    yAxisWidth={48}

                    />
              </Card>
              )))}
            
            
            
            </Grid>
            
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <div className="h-96" />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}


function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <h2>🌀 Loading...</h2>;

  }