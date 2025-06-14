import {Tabs} from "expo-router";
import {ImageBackground, Image, Text, View} from "react-native";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

const TabIcon = ({focused, icon, title}: any) => {
    if (focused)
    {
        return (
            <ImageBackground
                source={images.highlight}
                className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4
                            justify-center items-center rounded-full overflow-hidden'>
                <Image source={icon} tintColor='#151312' className='size-5' />
                <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
            </ImageBackground>
        )
    }
    else
    {
        return (
            <View className='size-full justify-center items-center rounded-full mt-4'>
                <Image source={icon} tintColor='#a8b5db' className='size-5' />
            </View>
        )
    }
}

export default function RootLayout() {
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            },
            tabBarStyle: {
                height: 55,
                backgroundColor: '#0f0d23',
                borderRadius: 50,
                marginHorizontal: 105,
                marginBottom: 36,
                position: 'absolute',
                overflow: 'visible',
                borderColor: '#0f0d23',
            }}}>

            <Tabs.Screen
                name="reminders"
                options={{
                    title: "Reminders",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.bell}
                            title='Reminders' />
                    )
            }}/>

            <Tabs.Screen
                name="videoplayer"
                options={{
                    title: "Videoplayer",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.play}
                            title='Videoplayer' />
                    )
                }}/>

        </Tabs>
    )
}
