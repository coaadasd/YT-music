import IndexComponent from "../component/indexComponent"
import Burger from "../component/burgerBar";

const Index = ({children}) => {
  return(
    <div>
      <Burger>
        <IndexComponent>
        </IndexComponent>
      </Burger>
    </div>
  )
}

export default Index;