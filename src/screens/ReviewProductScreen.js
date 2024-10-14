import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
  ProgressBarAndroidBase,
} from 'react-native';
import * as Progress from 'react-native-progress';

function ReviewProductScreen({ navigation }) {
  return (
    <ScrollView style={{ width: '100%', padding: 20, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 32, fontWeight: 700 }}>4.6</Text>
            <Text style={{ alignSelf: 'flex-end' }}>/5</Text>
          </View>

          <View>
            <Text>86 Reviews</Text>
          </View>
        </View>

        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: '#EDEDED',
            paddingLeft: 10,
          }}
        >
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../assets/star.png')} />
              <Image source={require('../assets/star.png')} />
              <Image source={require('../assets/star.png')} />
              <Image source={require('../assets/star.png')} />
              <Image source={require('../assets/star.png')} />
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Progress.Bar progress={0.5} color={'#FFC120'} width={138} />
                </View>

                <Text style={{}}>70</Text>
              </View>
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/star.png')} />
                <Image source={require('../assets/star.png')} />
                <Image source={require('../assets/star.png')} />
                <Image source={require('../assets/star.png')} />
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Progress.Bar progress={0.5} color={'#FFC120'} width={138} />
                </View>

                <Text style={{}}>70</Text>
              </View>
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/star.png')} />
                <Image source={require('../assets/star.png')} />
                <Image source={require('../assets/star.png')} />
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Progress.Bar progress={0.5} color={'#FFC120'} width={138} />
                </View>

                <Text style={{}}>70</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/star.png')} />
                <Image source={require('../assets/star.png')} />
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Progress.Bar progress={0.5} color={'#FFC120'} width={138} />
                </View>

                <Text style={{}}>70</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/star.png')} />
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Progress.Bar progress={0.5} color={'#FFC120'} width={138} />
                </View>

                <Text style={{}}>70</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>
          <View style={{ flex: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text>Yelena Belova</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                </View>
              </View>
              <View>
                <Text>2 Minggu yang lalu</Text>
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>
          <View style={{ flex: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text>Yelena Belova</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                </View>
              </View>
              <View>
                <Text>2 Minggu yang lalu</Text>
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>
          <View style={{ flex: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text>Yelena Belova</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                </View>
              </View>
              <View>
                <Text>2 Minggu yang lalu</Text>
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>
          <View style={{ flex: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text>Yelena Belova</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                </View>
              </View>
              <View>
                <Text>2 Minggu yang lalu</Text>
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>
          <View style={{ flex: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text>Yelena Belova</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                </View>
              </View>
              <View>
                <Text>2 Minggu yang lalu</Text>
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>
          <View style={{ flex: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text>Yelena Belova</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                </View>
              </View>
              <View>
                <Text>2 Minggu yang lalu</Text>
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>
          <View style={{ flex: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text>Yelena Belova</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                  <Image source={require('../assets/star.png')} />
                </View>
              </View>
              <View>
                <Text>2 Minggu yang lalu</Text>
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default ReviewProductScreen;
