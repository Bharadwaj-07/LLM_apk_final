import React, { useState } from "react";
export function ValidateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (regex.test(email));
}
export function ValidateUserName(Uname) {
    const regex = /^[a-zA-Z\s]+$/;

    return (regex.test(Uname));
}
export function ValidatePhoneNumber(phoneNumber) {
    const regex = /^[6-9]+[0-9]*$/;
    return (regex.test(phoneNumber) && phoneNumber.length == 10);
}
export function ValidateAge(Age) {
    const regex = /^[0-9]+/;
    return (regex.test(Age));
}
export function ValidateName(Name) {
    // const regex=/^[a-zA-Z]+(\s[a-zA-Z]+)*(\.[a-zA-Z]+)*$/
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)*(\.[a-zA-Z]+)*$/
    return (regex.test(Name));
}