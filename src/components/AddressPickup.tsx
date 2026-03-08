import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from '../constants/googleMapKey';

interface AddressPickupProps {
  placeholderText: string;
  fetchAddress: (
    lat: number,
    lng: number,
    zipCode: string,
    cityText: string
  ) => void;
}

const AddressPickup: React.FC<AddressPickupProps> = ({
  placeholderText,
  fetchAddress,
}) => {
  const onPressAddress = (
    data: any,
    details: GooglePlaceDetail | null
  ) => {
    if (!details) {
      return;
    }

    const resLength = details.address_components.length;
    let zipCode = '';

    const filtersResCity = details.address_components.filter((val:any) => {
      if (
        val.types.includes('locality') ||
        val.types.includes('sublocality')
      ) {
        return true;
      }

      if (val.types.includes('postal_code')) {
        zipCode = val.long_name;
      }

      return false;
    });

    const dataTextCityObj =
      filtersResCity.length > 0
        ? filtersResCity[0]
        : details.address_components[
            resLength > 1 ? resLength - 2 : resLength - 1
          ];

    const cityText =
      dataTextCityObj.long_name && dataTextCityObj.long_name.length > 17
        ? dataTextCityObj.short_name
        : dataTextCityObj.long_name;

    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;

    fetchAddress(lat, lng, zipCode, cityText);
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholderText}
        onPress={onPressAddress}
        fetchDetails={true}
        query={{
          key: GOOGLE_MAP_KEY,
          language: 'en',
        }}
        styles={{
          textInputContainer: styles.containerStyle,
          textInput: styles.textInputStyle,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyle: {
    backgroundColor: 'white',
  },
  textInputStyle: {
    height: 48,
    color: 'black',
    fontSize: 16,
    backgroundColor: '#f3f3f3',
  },
});

export default AddressPickup;
