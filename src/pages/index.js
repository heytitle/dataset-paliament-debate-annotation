import React, {useState, useEffect} from "react"

import axios from "axios"

import config from "../config"

import Layout from "../components/layout"
import SEO from "../components/seo"
import StatBox from "../components/stat-box"

import TopKList from "../components/top-k-list"
import DayList from "../components/day-list"
import ControlBox from "../components/control-box"
import PortionBar from "../components/portion-bar"
import PartyCard from "../components/party-card"

const IndexPage = () => {
  const [dataset, setDataset] = useState(config.datasets[0])
  const [data, setData] = useState({})
  const [nameFilter, setNameFilter] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(dataset.file)
      setData(result.data)
    };
    fetchData();
  }, [dataset])

  return <Layout>
    <SEO title="Home" />
    <h2>
      {
        // @todo #2 style the selector acccording to the design
      }
      <select>
        {
          config.datasets.map(d => {
            return <option key={d.name} value={d.file}>{d.name}</option>
          })
        }
      </select>
    </h2>
    {
      data.statistics &&
      <>
        <div style={{borderBottom: "1px dotted black"}}>
          <h2>สรุปเวลาการประชุม</h2>
          <div>
            <StatBox>
              <PortionBar
                leftLabel="รัฐบาล" rightLabel="ฝ่ายค้าน"
                leftDuration={7200} rightDuration={8000}
                leftColor="#0E64B9" rightColor="#E1161F"
              />
            </StatBox>
            <StatBox>
              <PortionBar
                leftLabel="อภิปราย" rightLabel="ประท้วง"
                leftDuration={data.statistics.total_duration_no_chairman}
                rightDuration={data.statistics.total_opposing_duration}
                leftColor="#FFFFFF" rightColor="#000000"
              />
            </StatBox>
            <div style={{height: "1.5rem", width: "100%", clear: "both"}}></div>
            <StatBox>
              <PartyCard title={`พรรคอภิปรายเยอะที่สุด`} partyName="พรรคผ่อน" duration={1300}/>
              <PartyCard title={`พรรคประท้วงเยอะที่สุด`} partyName="พรรครบ" duration={2400}/>
            </StatBox>
            <StatBox>
              <TopKList title="พูดนานสุด" list={data.statistics.top_debaters}/>
              <TopKList title="ประท้วง" list={data.statistics.top_opposers}/>
            </StatBox>
            <div style={{clear: "both"}}></div>
          </div>
        </div>
        <div>
          <ControlBox namePlaceholder={nameFilter}
            onNameSearch={(n) => setNameFilter(n)}
          />
          {
            data.dates.map(d => <DayList data={d} nameFilter={nameFilter}/>)
          }
        </div>
      </>

    }
  </Layout>
}

export default IndexPage
