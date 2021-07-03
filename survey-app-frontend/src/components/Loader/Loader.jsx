import React, { PureComponent } from 'react'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { withRouter } from "react-router"
import "./Loader.scss"
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
class Loader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <div className="row text-center">
                <div className="col-md-12">
                    <Spin indicator={antIcon} tip="Fetching..." className={this.props.className} />
                </div>

            </div>

        );
    }
}

export default withRouter(Loader);


