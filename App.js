import React from 'react';
import { StyleSheet, Text, View, ListView, ActivityIndicator } from 'react-native';
import PaginatedListView from 'react-native-paginated-listview';
import Config from './config.json'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ''
    }
  }

  getToken() {
     requestObject = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: Config.client_id,
                client_secret: Config.client_secret
              })
      }

      return fetch('https://test.inploi.me/token', requestObject)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({token:responseJson.access_token});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getJobs(page, count) {
      return fetch('https://test.inploi.me/jobs/'+page+'?token=' + this.state.token)
      .then((response) => response.json())
      .then((responseJson) => responseJson.browse)
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
     this.getToken();
  }

  render() {
    let pageList = this.state.token ? <PaginatedListView
        style={{marginTop: 25, flex:1}}
        renderRow={(itemData) => {
          return ( <View style={styles.listItemContainer}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={styles.listItemTextRole}>{itemData.role}</Text>
              <Text style={styles.listItemSubDetails}>{itemData.rate} {itemData.rate_type}</Text>
            </View>
            <Text style={styles.listItemSubDetails}>{itemData.company}</Text>
            <Text style={styles.listItemSubDetails}>{itemData.company_type}</Text>
            </View>
            );
        }}
        itemsPerPage={10}
        onFetch={this.getJobs.bind(this)}
      /> : <ActivityIndicator/>;
 
    return (
      <View style={styles.container}>
        {pageList}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItemContainer: {
    margin: 10,
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  listItemTextRole: {
    fontSize: 24,
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
  },
  listItemSubDetails: {
    fontSize: 18, 
    textAlign: 'left',
    color: '#333',
  },
});
