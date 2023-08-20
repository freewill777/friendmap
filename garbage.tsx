// renderItem = {({ item }) =>
// item.id < photosLength + videosLength ? (
//     <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
//         <Image
//             style={{
//                 width: width / 3.0 - 16,
//                 height: height / 5.0,
//                 borderRadius: 8,
//                 margin: 8,
//             }}
//             source={{
//                 uri: `${host}/photo?userId=${userId}&index=${item.id
//                     }`,
//             }}
//         />
//     </View>
// ) : (
//     <TouchableOpacity activeOpacity={0.8}>
//         <Video
//             source={{
//                 uri: `${host}/video?userId=${userId}&index=${item.id}`,
//             }}
//             useNativeControls
//             resizeMode={ResizeMode.CONTAIN}
//             isLooping
//             style={{
//                 width: width / 3.0 - 16,
//                 height: height / 5.0,
//                 borderRadius: 8,
//                 margin: 8,
//             }}
//         />
//     </TouchableOpacity>
// )
// }