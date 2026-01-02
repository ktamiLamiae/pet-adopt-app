import { StyleSheet, View } from 'react-native';
import PetSubInfoCard from './PetSubInfoCard';

export default function PetSubInfo({ pet }) {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.row}>
                <PetSubInfoCard
                    icon={require('../../assets/images/project/calendar.png')}
                    title={'Age'}
                    value={pet?.age + ' Years'}
                />
                <PetSubInfoCard
                    icon={require('../../assets/images/project/bone.png')}
                    title={'Breed'}
                    value={pet?.breed}
                />
            </View>
            <View style={styles.row}>
                <PetSubInfoCard
                    icon={require('../../assets/images/project/sex.png')}
                    title={'Sex'}
                    value={pet?.sex}
                />
                <PetSubInfoCard
                    icon={require('../../assets/images/project/weight.png')}
                    title={'Weight'}
                    value={pet?.weight + ' Kg'}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 20
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    }
});
