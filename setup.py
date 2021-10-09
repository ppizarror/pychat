"""
Setup distribution.
"""
from setuptools import setup, find_packages

# Load requirements
with open('requirements.txt') as f:
    requirements = []
    for line in f:
        requirements.append(line.strip())
# Setup library
setup(
    name='PyChat',
    version='1.0',
    author='ppizarror',
    author_email='pablo@ppizarror.com',
    description='Academic example of a chat implemented in python cgi + js',
    long_description='Academic example of a chat implemented in python cgi + js',
    url='https://github.com/ppizarror/pychat',
    project_urls={
        'Bug Tracker': 'https://github.com/ppizarror/pychat',
        'Documentation': 'https://github.com/ppizarror/pychat',
        'Source Code': 'https://github.com/ppizarror/pychat'
    },
    license='MIT',
    platforms=['any'],
    classifiers=[
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python',
        'Topic :: Games/Entertainment',
        'Topic :: Multimedia',
        'Topic :: Text Processing'
    ],
    include_package_data=True,
    packages=find_packages(exclude=['test']),
    python_requires='>=3.6, <4',
    install_requires=requirements,
    setup_requires=[
        'setuptools',
    ],
    options={
        'bdist_wheel': {'universal': False}
    }
)
